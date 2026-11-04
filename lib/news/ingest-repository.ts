import { getDb } from "@/lib/db/client";
import type { ArticleCategory } from "@/lib/news/categories";

const now = () => new Date().toISOString();
export const settingKeys = ["ingest_enabled", "hold_sensitive"] as const;
export type SettingKey = (typeof settingKeys)[number];

export async function getSettings(): Promise<{ ingestEnabled: boolean; holdSensitive: boolean }> {
  const { results } = await (await getDb()).prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
  const map = new Map(results.map((r) => [r.key, r.value]));
  return { ingestEnabled: map.get("ingest_enabled") === "1", holdSensitive: map.get("hold_sensitive") !== "0" };
}

export async function setSetting(key: SettingKey, on: boolean, actor: string): Promise<void> {
  const db = await getDb(); const t = now();
  await db.batch([
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value").bind(key, on ? "1" : "0"),
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'setting', 'setting', ?, ?)").bind(t, actor, key, on ? "on" : "off"),
  ]);
}

export type SourceRow = { id: string; name: string; url: string; language: "en" | "ko"; defaultCategory: ArticleCategory; enabled: boolean; lastRunAt: string | null; lastError: string | null };

export async function listSources(): Promise<SourceRow[]> {
  const { results } = await (await getDb()).prepare("SELECT id, name, url, language, default_category, enabled, last_run_at, last_error FROM sources ORDER BY created_at")
    .all<{ id: string; name: string; url: string; language: "en" | "ko"; default_category: ArticleCategory; enabled: number; last_run_at: string | null; last_error: string | null }>();
  return results.map((r) => ({ id: r.id, name: r.name, url: r.url, language: r.language, defaultCategory: r.default_category, enabled: r.enabled === 1, lastRunAt: r.last_run_at, lastError: r.last_error }));
}

export class SourceExistsError extends Error {}

export async function addSource(input: { name: string; url: string; language: "en" | "ko"; defaultCategory: ArticleCategory }, actor: string): Promise<void> {
  const db = await getDb(); const t = now(); const id = crypto.randomUUID();
  const clash = await db.prepare("SELECT id FROM sources WHERE url = ?").bind(input.url).first();
  if (clash) throw new SourceExistsError();
  await db.batch([
    db.prepare("INSERT INTO sources (id, name, url, language, default_category, enabled, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)").bind(id, input.name, input.url, input.language, input.defaultCategory, t),
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'create', 'source', ?, ?)").bind(t, actor, id, input.name),
  ]);
}

export async function setSourceEnabled(id: string, enabled: boolean, actor: string): Promise<void> {
  const db = await getDb();
  await db.batch([
    db.prepare("UPDATE sources SET enabled = ? WHERE id = ?").bind(enabled ? 1 : 0, id),
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'status', 'source', ?, ?)").bind(now(), actor, id, enabled ? "enabled" : "disabled"),
  ]);
}

export async function deleteSource(id: string, actor: string): Promise<void> {
  const db = await getDb();
  await db.batch([
    db.prepare("DELETE FROM sources WHERE id = ?").bind(id), // ledger rows go with it (ON DELETE CASCADE); articles stay
    db.prepare("INSERT INTO audit_log (at, actor, action, entity, entity_id, detail) VALUES (?, ?, 'delete', 'source', ?, NULL)").bind(now(), actor, id),
  ]);
}

export type IngestLogRow = { id: number; at: string; source: string; title: string; url: string; status: "published" | "held" | "skipped" | "failed"; reason: string | null; attempts: number; articleId: string | null };

export async function recentIngest(limit = 40): Promise<IngestLogRow[]> {
  const { results } = await (await getDb()).prepare(
    `SELECT i.id, i.created_at, s.name AS source, i.title, i.url, i.status, i.reason, i.attempts, i.article_id
       FROM ingest_items i JOIN sources s ON s.id = i.source_id ORDER BY i.id DESC LIMIT ?`,
  ).bind(limit).all<{ id: number; created_at: string; source: string; title: string; url: string; status: IngestLogRow["status"]; reason: string | null; attempts: number; article_id: string | null }>();
  return results.map((r) => ({ id: r.id, at: r.created_at, source: r.source, title: r.title, url: r.url, status: r.status, reason: r.reason, attempts: r.attempts, articleId: r.article_id }));
}
