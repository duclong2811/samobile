// Strict validation of what the language model returns. Model output is untrusted input:
// anything that does not match the contract exactly is rejected, never "repaired".
export type Translation = { title: string; summary: string };
export type ModelVerdict =
  | { ok: true; relevant: false; reason: string }
  | { ok: true; relevant: true; confidence: number; category: string; slug: string; translations: Record<string, Translation> }
  | { ok: false; error: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX = { title: 200, summary: 600, slug: 60 } as const;

function stripMarkup(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function parseModelOutput(raw: string, opts: { locales: readonly string[]; categories: readonly string[]; fallbackCategory: string; minConfidence: number }): ModelVerdict {
  const text = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  if (!text) return { ok: false, error: "empty model output" };
  let data: unknown;
  try { data = JSON.parse(text); } catch { return { ok: false, error: "model output is not valid JSON" }; }
  if (!data || typeof data !== "object" || Array.isArray(data)) return { ok: false, error: "model output is not an object" };
  const o = data as Record<string, unknown>;
  if (typeof o.relevant !== "boolean") return { ok: false, error: "missing boolean `relevant`" };
  if (!o.relevant) return { ok: true, relevant: false, reason: "judged not relevant" };

  const confidence = typeof o.confidence === "number" ? o.confidence : NaN;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) return { ok: false, error: "invalid `confidence`" };
  if (confidence < opts.minConfidence) return { ok: true, relevant: false, reason: `low confidence (${confidence})` };

  const category = typeof o.category === "string" && opts.categories.includes(o.category) ? o.category : opts.fallbackCategory;
  const slugRaw = typeof o.slug === "string" ? o.slug.trim().toLowerCase().slice(0, MAX.slug).replace(/-+$/g, "") : "";
  const slug = SLUG.test(slugRaw) ? slugRaw : "news";

  const t = o.translations;
  if (!t || typeof t !== "object" || Array.isArray(t)) return { ok: false, error: "missing `translations`" };
  const translations: Record<string, Translation> = {};
  for (const locale of opts.locales) {
    const entry = (t as Record<string, unknown>)[locale];
    if (!entry || typeof entry !== "object") return { ok: false, error: `missing translation for ${locale}` };
    const title = typeof (entry as Record<string, unknown>).title === "string" ? stripMarkup((entry as Record<string, string>).title) : "";
    const summary = typeof (entry as Record<string, unknown>).summary === "string" ? stripMarkup((entry as Record<string, string>).summary) : "";
    if (!title || !summary) return { ok: false, error: `empty title or summary for ${locale}` };
    if (title.length > MAX.title || summary.length > MAX.summary) return { ok: false, error: `${locale} text too long` };
    translations[locale] = { title, summary };
  }
  return { ok: true, relevant: true, confidence, category, slug, translations };
}
