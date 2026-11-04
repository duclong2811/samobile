// News ingestion: read configured feeds -> skip what was already seen -> ask the model to judge relevance
// and translate -> store the result as an article. Runs inside the separate `samobile-ingest` Worker.
// Relative imports only: this file is bundled by wrangler, which does not know the app's `@/` alias.
import type { D1Database, D1Statement } from "../db/types";
import { locales as allLocales } from "../i18n/config";
import { articleCategories, sensitiveCategories } from "../news/categories";
import { buildMessages, callModel, type FetchImpl, type LlmConfig } from "./deepseek";
import { parseModelOutput } from "./model-output";
import { parseFeed, type FeedItem } from "./rss";

export type IngestEnv = {
  DB: D1Database;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_BASE_URL?: string;
  DEEPSEEK_MODEL?: string;
  MAX_ITEMS_PER_RUN?: string;
  TARGET_LOCALES?: string;
  /** "1" allows http:// feeds and model endpoints. For local testing only. */
  ALLOW_INSECURE_SOURCES?: string;
};

export type IngestSummary = {
  status: "disabled" | "misconfigured" | "done" | "aborted";
  message?: string;
  sources: number; considered: number; published: number; held: number; skipped: number; failed: number;
};

type SourceRow = { id: string; name: string; url: string; language: string; default_category: string };

const MIN_DESCRIPTION = 40;      // too little text to summarize faithfully: do not spend a model call
const MAX_ATTEMPTS = 3;          // failed items are retried on later runs, then given up on
const MIN_CONFIDENCE = 0.6;
const FEED_LIMIT_BYTES = 2_000_000;

function readConfig(env: IngestEnv): { ok: true; llm: LlmConfig; locales: string[]; maxItems: number; insecure: boolean } | { ok: false; error: string } {
  const insecure = env.ALLOW_INSECURE_SOURCES === "1";
  if (!env.DEEPSEEK_API_KEY) return { ok: false, error: "DEEPSEEK_API_KEY secret is not set" };
  if (!env.DEEPSEEK_MODEL?.trim()) return { ok: false, error: "DEEPSEEK_MODEL is empty: set it in workers/ingest/wrangler.jsonc" };
  const baseUrl = (env.DEEPSEEK_BASE_URL ?? "").trim();
  if (!/^https:\/\//.test(baseUrl) && !(insecure && /^http:\/\//.test(baseUrl))) return { ok: false, error: "DEEPSEEK_BASE_URL must be an https:// URL" };
  const locales = (env.TARGET_LOCALES ?? "vi,ne,th,uz").split(",").map((l) => l.trim()).filter(Boolean);
  if (locales.length === 0 || locales.some((l) => !(allLocales as readonly string[]).includes(l))) return { ok: false, error: "TARGET_LOCALES contains an unsupported locale" };
  const maxItems = Math.min(30, Math.max(1, parseInt(env.MAX_ITEMS_PER_RUN ?? "6", 10) || 6));
  return { ok: true, llm: { apiKey: env.DEEPSEEK_API_KEY, baseUrl, model: env.DEEPSEEK_MODEL.trim() }, locales: [...new Set(locales)], maxItems, insecure };
}

async function setting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

async function fetchFeedText(url: string, fetchImpl: FetchImpl, insecure: boolean): Promise<string> {
  if (!/^https:\/\//.test(url) && !(insecure && /^http:\/\//.test(url))) throw new Error("feed URL must be https");
  const response = await fetchImpl(url, { headers: { "user-agent": "SAmobileNewsBot/1.0", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`feed HTTP ${response.status}`);
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > FEED_LIMIT_BYTES) throw new Error("feed too large");
  const text = await response.text();
  if (text.length > FEED_LIMIT_BYTES) throw new Error("feed too large");
  return text;
}

function upsertLedger(db: D1Database, p: { sourceId: string; item: FeedItem; status: string; reason: string | null; articleId: string | null; at: string }): D1Statement {
  return db.prepare(
    `INSERT INTO ingest_items (source_id, item_key, url, title, status, reason, attempts, article_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
     ON CONFLICT (source_id, item_key) DO UPDATE SET status = excluded.status, reason = excluded.reason,
       attempts = ingest_items.attempts + 1, article_id = excluded.article_id`,
  ).bind(p.sourceId, p.item.key, p.item.link, p.item.title.slice(0, 300), p.status, p.reason?.slice(0, 300) ?? null, p.articleId, p.at);
}

export async function runIngest(env: IngestEnv, opts: { fetchImpl?: FetchImpl; now?: () => Date } = {}): Promise<IngestSummary> {
  const db = env.DB;
  const fetchImpl: FetchImpl = opts.fetchImpl ?? ((u, i) => fetch(u, i));
  const now = opts.now ?? (() => new Date());
  const summary: IngestSummary = { status: "done", sources: 0, considered: 0, published: 0, held: 0, skipped: 0, failed: 0 };

  if ((await setting(db, "ingest_enabled")) !== "1") return { ...summary, status: "disabled", message: "ingestion is switched off in the admin" };
  const config = readConfig(env);
  if (!config.ok) return { ...summary, status: "misconfigured", message: config.error };
  const holdSensitive = (await setting(db, "hold_sensitive")) !== "0";

  const { results: sources } = await db.prepare("SELECT id, name, url, language, default_category FROM sources WHERE enabled = 1 ORDER BY created_at").all<SourceRow>();
  summary.sources = sources.length;

  // Collect new candidates per source, then interleave so one busy feed cannot use the whole budget.
  const queues: { source: SourceRow; items: FeedItem[] }[] = [];
  for (const source of sources) {
    try {
      const items = parseFeed(await fetchFeedText(source.url, fetchImpl, config.insecure), 20);
      let fresh = items;
      if (items.length) {
        const marks = items.map(() => "?").join(",");
        const { results: seen } = await db.prepare(`SELECT item_key, status, attempts FROM ingest_items WHERE source_id = ? AND item_key IN (${marks})`)
          .bind(source.id, ...items.map((i) => i.key)).all<{ item_key: string; status: string; attempts: number }>();
        const done = new Set(seen.filter((r) => r.status !== "failed" || r.attempts >= MAX_ATTEMPTS).map((r) => r.item_key));
        fresh = items.filter((i) => !done.has(i.key));
      }
      queues.push({ source, items: fresh });
      await db.prepare("UPDATE sources SET last_run_at = ?, last_error = NULL WHERE id = ?").bind(now().toISOString(), source.id).run();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await db.prepare("UPDATE sources SET last_run_at = ?, last_error = ? WHERE id = ?").bind(now().toISOString(), message.slice(0, 300), source.id).run();
    }
  }
  const order: { source: SourceRow; item: FeedItem }[] = [];
  for (let round = 0; queues.some((q) => q.items[round]); round++) for (const q of queues) if (q.items[round]) order.push({ source: q.source, item: q.items[round] });

  for (const { source, item } of order.slice(0, config.maxItems)) {
    summary.considered++;
    const at = now().toISOString();
    try {
      if (item.description.length < MIN_DESCRIPTION) {
        await upsertLedger(db, { sourceId: source.id, item, status: "skipped", reason: "feed gives too little text", articleId: null, at }).run();
        summary.skipped++; continue;
      }
      const raw = await callModel(config.llm, buildMessages({ sourceName: source.name, sourceLanguage: source.language, title: item.title, description: item.description, locales: config.locales, categories: articleCategories }), fetchImpl);
      const verdict = parseModelOutput(raw, { locales: config.locales, categories: articleCategories, fallbackCategory: source.default_category, minConfidence: MIN_CONFIDENCE });
      if (!verdict.ok) throw new Error(verdict.error);
      if (!verdict.relevant) {
        await upsertLedger(db, { sourceId: source.id, item, status: "skipped", reason: verdict.reason, articleId: null, at }).run();
        summary.skipped++; continue;
      }

      const id = crypto.randomUUID();
      const slug = `${verdict.slug}-${id.slice(0, 8)}`;
      const hold = holdSensitive && (sensitiveCategories as readonly string[]).includes(verdict.category);
      const status = hold ? "draft" : "published";
      const batch: D1Statement[] = [
        db.prepare("INSERT INTO articles (id, slug, status, category, origin, source_name, source_url, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, 'auto', ?, ?, ?, ?, ?)")
          .bind(id, slug, status, verdict.category, source.name, item.link, hold ? null : at, at, at),
        ...config.locales.map((locale) => db.prepare("INSERT INTO article_translations (article_id, locale, title, summary, body, machine_translated, updated_at) VALUES (?, ?, ?, ?, '', 1, ?)")
          .bind(id, locale, verdict.translations[locale].title, verdict.translations[locale].summary, at)),
        db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, 'ingest', 'create', 'article', ?, ?)").bind(at, id, `${status}; ${source.name}; confidence ${verdict.confidence}`),
        upsertLedger(db, { sourceId: source.id, item, status: hold ? "held" : "published", reason: hold ? `held for review (${verdict.category})` : null, articleId: id, at }),
      ];
      await db.batch(batch); // article, translations, audit entry and ledger row succeed or fail together
      if (hold) summary.held++; else summary.published++;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      summary.failed++;
      try { await upsertLedger(db, { sourceId: source.id, item, status: "failed", reason: message, articleId: null, at }).run(); } catch { /* ledger write is best-effort here */ }
      // Bad key or no balance: every further call would fail (or bill) the same way. Stop now.
      if (/HTTP (401|402|403)\b/.test(message)) return { ...summary, status: "aborted", message: "the model API rejected the key or account (check DEEPSEEK_API_KEY and balance)" };
    }
  }
  return summary;
}
