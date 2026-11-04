import { getDb } from "@/lib/db/client";
import type { D1Statement } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { ArticleCategory, ArticleInput, ArticleStatus } from "@/lib/admin/validation";

const now = () => new Date().toISOString();

// ---------- Public (published only) ----------
export type PublicArticle = {
  slug: string; category: ArticleCategory; title: string; summary: string; body: string;
  machineTranslated: boolean; sourceName: string | null; sourceUrl: string | null; publishedAt: string;
};

type PublicRow = {
  slug: string; category: ArticleCategory; title: string; summary: string; body: string;
  machine_translated: number; source_name: string | null; source_url: string | null; published_at: string;
};
const toPublic = (r: PublicRow): PublicArticle => ({
  slug: r.slug, category: r.category, title: r.title, summary: r.summary, body: r.body,
  machineTranslated: r.machine_translated === 1, sourceName: r.source_name, sourceUrl: r.source_url, publishedAt: r.published_at,
});

export async function listPublished(locale: Locale, limit = 50): Promise<PublicArticle[]> {
  const { results } = await (await getDb()).prepare(
    `SELECT a.slug, a.category, a.source_name, a.source_url, a.published_at,
            t.title, t.summary, t.body, t.machine_translated
       FROM articles a JOIN article_translations t ON t.article_id = a.id AND t.locale = ?
      WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT ?`,
  ).bind(locale, limit).all<PublicRow>();
  return results.map(toPublic);
}

export async function getPublished(locale: Locale, slug: string): Promise<PublicArticle | null> {
  const row = await (await getDb()).prepare(
    `SELECT a.slug, a.category, a.source_name, a.source_url, a.published_at,
            t.title, t.summary, t.body, t.machine_translated
       FROM articles a JOIN article_translations t ON t.article_id = a.id AND t.locale = ?
      WHERE a.status = 'published' AND a.slug = ?`,
  ).bind(locale, slug).first<PublicRow>();
  return row ? toPublic(row) : null;
}

// ---------- Admin ----------
export type AdminArticleRow = {
  id: string; slug: string; status: ArticleStatus; category: ArticleCategory; origin: "manual" | "auto";
  title: string; locales: string[]; updatedAt: string; publishedAt: string | null;
};

export async function listForAdmin(opts: { status?: ArticleStatus; q?: string }): Promise<AdminArticleRow[]> {
  const where: string[] = []; const args: unknown[] = [];
  if (opts.status) { where.push("a.status = ?"); args.push(opts.status); }
  if (opts.q) {
    where.push("EXISTS (SELECT 1 FROM article_translations x WHERE x.article_id = a.id AND (x.title LIKE ? ESCAPE '\\' OR a.slug LIKE ? ESCAPE '\\'))");
    const like = `%${opts.q.replace(/[\\%_]/g, "\\$&")}%`; args.push(like, like);
  }
  const { results } = await (await getDb()).prepare(
    `SELECT a.id, a.slug, a.status, a.category, a.origin, a.updated_at, a.published_at,
            (SELECT title FROM article_translations WHERE article_id = a.id
              ORDER BY CASE locale WHEN 'vi' THEN 0 WHEN 'en' THEN 1 ELSE 2 END LIMIT 1) AS title,
            (SELECT group_concat(locale) FROM article_translations WHERE article_id = a.id) AS locales
       FROM articles a ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY a.updated_at DESC LIMIT 200`,
  ).bind(...args).all<{ id: string; slug: string; status: ArticleStatus; category: ArticleCategory; origin: "manual" | "auto"; updated_at: string; published_at: string | null; title: string | null; locales: string | null }>();
  return results.map((r) => ({
    id: r.id, slug: r.slug, status: r.status, category: r.category, origin: r.origin,
    title: r.title ?? r.slug, locales: r.locales ? r.locales.split(",") : [], updatedAt: r.updated_at, publishedAt: r.published_at,
  }));
}

export async function countByStatus(): Promise<Record<ArticleStatus, number>> {
  const { results } = await (await getDb()).prepare("SELECT status, COUNT(*) AS n FROM articles GROUP BY status").all<{ status: ArticleStatus; n: number }>();
  const out: Record<ArticleStatus, number> = { draft: 0, published: 0, hidden: 0 };
  for (const r of results) out[r.status] = r.n;
  return out;
}

export type AdminArticle = {
  id: string; slug: string; status: ArticleStatus; category: ArticleCategory; origin: "manual" | "auto";
  sourceName: string | null; sourceUrl: string | null; publishedAt: string | null;
  translations: Record<string, { title: string; summary: string; body: string; machineTranslated: boolean }>;
};

export async function getForAdmin(id: string): Promise<AdminArticle | null> {
  const db = await getDb();
  const a = await db.prepare("SELECT id, slug, status, category, origin, source_name, source_url, published_at FROM articles WHERE id = ?")
    .bind(id).first<{ id: string; slug: string; status: ArticleStatus; category: ArticleCategory; origin: "manual" | "auto"; source_name: string | null; source_url: string | null; published_at: string | null }>();
  if (!a) return null;
  const { results } = await db.prepare("SELECT locale, title, summary, body, machine_translated FROM article_translations WHERE article_id = ?")
    .bind(id).all<{ locale: string; title: string; summary: string; body: string; machine_translated: number }>();
  const translations: AdminArticle["translations"] = {};
  for (const r of results) translations[r.locale] = { title: r.title, summary: r.summary, body: r.body, machineTranslated: r.machine_translated === 1 };
  return { id: a.id, slug: a.slug, status: a.status, category: a.category, origin: a.origin, sourceName: a.source_name, sourceUrl: a.source_url, publishedAt: a.published_at, translations };
}

export class SlugTakenError extends Error {}

/** Creates or updates an article with all its translations atomically (one D1 batch). Returns the id. */
export async function saveArticle(input: ArticleInput, actor: string): Promise<string> {
  const db = await getDb();
  const t = now();
  const id = input.id ?? crypto.randomUUID();

  const clash = await db.prepare("SELECT id FROM articles WHERE slug = ? AND id != ?").bind(input.slug, id).first();
  if (clash) throw new SlugTakenError();

  const existing = input.id ? await db.prepare("SELECT status, published_at FROM articles WHERE id = ?").bind(id).first<{ status: ArticleStatus; published_at: string | null }>() : null;
  if (input.id && !existing) throw new Error("Article not found.");
  // published_at is stamped the first time an article goes live and then kept stable.
  const publishedAt = input.status === "published" ? existing?.published_at ?? t : existing?.published_at ?? null;

  const batch: D1Statement[] = [];
  if (existing) {
    batch.push(db.prepare("UPDATE articles SET slug = ?, status = ?, category = ?, source_name = ?, source_url = ?, published_at = ?, updated_at = ? WHERE id = ?")
      .bind(input.slug, input.status, input.category, input.sourceName, input.sourceUrl, publishedAt, t, id));
  } else {
    batch.push(db.prepare("INSERT INTO articles (id, slug, status, category, origin, source_name, source_url, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, 'manual', ?, ?, ?, ?, ?)")
      .bind(id, input.slug, input.status, input.category, input.sourceName, input.sourceUrl, publishedAt, t, t));
  }
  batch.push(db.prepare("DELETE FROM article_translations WHERE article_id = ?").bind(id));
  for (const tr of input.translations) {
    batch.push(db.prepare("INSERT INTO article_translations (article_id, locale, title, summary, body, machine_translated, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, tr.locale, tr.title, tr.summary, tr.body, tr.machineTranslated ? 1 : 0, t));
  }
  batch.push(db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, ?, 'article', ?, ?)")
    .bind(t, actor, existing ? "update" : "create", id, `${input.status}; ${input.translations.map((x) => x.locale).join(",")}`));
  await db.batch(batch);
  return id;
}

export async function setArticleStatus(id: string, status: ArticleStatus, actor: string): Promise<void> {
  const db = await getDb(); const t = now();
  await db.batch([
    db.prepare("UPDATE articles SET status = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END, updated_at = ? WHERE id = ?").bind(status, status, t, t, id),
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'status', 'article', ?, ?)").bind(t, actor, id, status),
  ]);
}

export async function deleteArticle(id: string, actor: string): Promise<void> {
  const db = await getDb();
  await db.batch([
    db.prepare("DELETE FROM article_translations WHERE article_id = ?").bind(id),
    db.prepare("DELETE FROM articles WHERE id = ?").bind(id),
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'delete', 'article', ?, NULL)").bind(now(), actor, id),
  ]);
}

export async function recentAudit(limit = 8): Promise<{ at: string; actor: string; action: string; entityId: string; detail: string | null }[]> {
  const { results } = await (await getDb()).prepare("SELECT at, actor, action, entity_id, detail FROM audit_log ORDER BY id DESC LIMIT ?").bind(limit)
    .all<{ at: string; actor: string; action: string; entity_id: string; detail: string | null }>();
  return results.map((r) => ({ at: r.at, actor: r.actor, action: r.action, entityId: r.entity_id, detail: r.detail }));
}
