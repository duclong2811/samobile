import { locales, type Locale } from "@/lib/i18n/config";
import { articleCategories, type ArticleCategory } from "@/lib/news/categories";
export { articleCategories, sensitiveCategories, type ArticleCategory } from "@/lib/news/categories";

export const articleStatuses = ["draft", "published", "hidden"] as const;
export type ArticleStatus = (typeof articleStatuses)[number];

export const limits = { title: 200, summary: 600, body: 20000, slug: 80, sourceName: 120, sourceUrl: 500 } as const;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ArticleInput = {
  id: string | null;
  slug: string;
  status: ArticleStatus;
  category: ArticleCategory;
  sourceName: string | null;
  sourceUrl: string | null;
  translations: { locale: Locale; title: string; summary: string; body: string; machineTranslated: boolean }[];
};

const text = (form: FormData, name: string) => String(form.get(name) ?? "").replace(/\r\n/g, "\n").trim();

export function slugify(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, limits.slug).replace(/-+$/g, "");
}

export function parseArticleForm(form: FormData): { ok: true; value: ArticleInput } | { ok: false; error: string } {
  const status = text(form, "status");
  const category = text(form, "category");
  if (!(articleStatuses as readonly string[]).includes(status)) return { ok: false, error: "Trạng thái không hợp lệ." };
  if (!(articleCategories as readonly string[]).includes(category)) return { ok: false, error: "Chuyên mục không hợp lệ." };

  const translations: ArticleInput["translations"] = [];
  for (const locale of locales) {
    const title = text(form, `title_${locale}`);
    const summary = text(form, `summary_${locale}`);
    const body = text(form, `body_${locale}`);
    if (!title) {
      if (summary || body) return { ok: false, error: `Ngôn ngữ ${locale.toUpperCase()}: có nội dung nhưng thiếu tiêu đề.` };
      continue;
    }
    if (title.length > limits.title) return { ok: false, error: `Ngôn ngữ ${locale.toUpperCase()}: tiêu đề quá dài (tối đa ${limits.title} ký tự).` };
    if (summary.length > limits.summary) return { ok: false, error: `Ngôn ngữ ${locale.toUpperCase()}: tóm tắt quá dài (tối đa ${limits.summary} ký tự).` };
    if (body.length > limits.body) return { ok: false, error: `Ngôn ngữ ${locale.toUpperCase()}: nội dung quá dài (tối đa ${limits.body} ký tự).` };
    translations.push({ locale, title, summary, body, machineTranslated: form.get(`mt_${locale}`) === "on" });
  }
  if (translations.length === 0) return { ok: false, error: "Cần ít nhất một ngôn ngữ có tiêu đề." };

  let slug = text(form, "slug").toLowerCase();
  if (!slug) {
    const base = translations.find((t) => t.locale === "en") ?? translations[0];
    slug = slugify(base.title);
  }
  if (!slug) slug = `article-${crypto.randomUUID().slice(0, 8)}`;
  if (slug.length > limits.slug || !SLUG.test(slug)) return { ok: false, error: "Đường dẫn (slug) chỉ gồm chữ thường không dấu, số và dấu gạch ngang." };

  const sourceName = text(form, "sourceName") || null;
  let sourceUrl = text(form, "sourceUrl") || null;
  if (sourceName && sourceName.length > limits.sourceName) return { ok: false, error: "Tên nguồn quá dài." };
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
      sourceUrl = url.toString();
    } catch { return { ok: false, error: "Link nguồn phải là địa chỉ http(s) hợp lệ." }; }
    if (sourceUrl.length > limits.sourceUrl) return { ok: false, error: "Link nguồn quá dài." };
  }

  const id = text(form, "id") || null;
  return { ok: true, value: { id, slug, status: status as ArticleStatus, category: category as ArticleCategory, sourceName, sourceUrl, translations } };
}
