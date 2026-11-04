"use server";

import { redirect } from "next/navigation";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/auth";
import { assertSameOrigin } from "@/lib/admin/security";
import { articleStatuses, parseArticleForm, type ArticleStatus } from "@/lib/admin/validation";
import { deleteArticle, saveArticle, setArticleStatus, SlugTakenError } from "@/lib/news/repository";

export type FormState = { error?: string; values?: Record<string, string>; nonce?: number };

// Every action: same-origin check + its own admin check (Server Actions can be POSTed directly).
export async function saveArticleAction(_prev: FormState, form: FormData): Promise<FormState> {
  await assertSameOrigin();
  let admin;
  try { admin = await requireAdmin(); } catch (e) {
    if (e instanceof UnauthorizedError) return { error: "Phiên đăng nhập đã hết hạn. Hãy tải lại trang.", nonce: Date.now() };
    throw e;
  }
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) if (typeof value === "string") values[key] = value;

  // "Save & publish" works with or without client JS: the select is set on click, and `intent` covers native submits.
  if (form.get("intent") === "publish") form.set("status", "published");
  const parsed = parseArticleForm(form);
  if (!parsed.ok) return { error: parsed.error, values, nonce: Date.now() };

  let id: string;
  try { id = await saveArticle(parsed.value, admin.email); } catch (e) {
    if (e instanceof SlugTakenError) return { error: "Đường dẫn (slug) này đã được bài khác dùng.", values, nonce: Date.now() };
    throw e;
  }
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function setStatusAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const id = String(form.get("id") ?? ""); const status = String(form.get("status") ?? "");
  if (!id || !(articleStatuses as readonly string[]).includes(status)) throw new Error("Invalid request.");
  await setArticleStatus(id, status as ArticleStatus, admin.email);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function deleteArticleAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!id) throw new Error("Invalid request.");
  await deleteArticle(id, admin.email);
  redirect("/admin/articles?deleted=1");
}
