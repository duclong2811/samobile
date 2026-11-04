import { locales } from "@/lib/i18n/config";
import type { AdminArticle } from "@/lib/news/repository";

/** Flat, serialisable form values shared by the server page and the client editor. */
export type EditorValues = Record<string, string>;

export function toEditorValues(article: AdminArticle | null): EditorValues {
  const v: EditorValues = {
    id: article?.id ?? "", slug: article?.slug ?? "", status: article?.status ?? "draft", category: article?.category ?? "general",
    sourceName: article?.sourceName ?? "", sourceUrl: article?.sourceUrl ?? "", origin: article?.origin ?? "manual",
  };
  for (const locale of locales) {
    const t = article?.translations[locale];
    v[`title_${locale}`] = t?.title ?? ""; v[`summary_${locale}`] = t?.summary ?? "";
    v[`body_${locale}`] = t?.body ?? ""; v[`mt_${locale}`] = t?.machineTranslated ? "on" : "";
  }
  return v;
}
