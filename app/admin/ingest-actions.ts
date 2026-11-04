"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { assertSameOrigin } from "@/lib/admin/security";
import { articleCategories, type ArticleCategory } from "@/lib/news/categories";
import { addSource, deleteSource, setSetting, setSourceEnabled, settingKeys, SourceExistsError, type SettingKey } from "@/lib/news/ingest-repository";

const BACK = "/admin/ingest";
const fail = (message: string): never => redirect(`${BACK}?error=${encodeURIComponent(message)}`);
const str = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

export async function setSettingAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const key = str(form, "key"); const value = str(form, "value");
  if (!(settingKeys as readonly string[]).includes(key) || (value !== "0" && value !== "1")) throw new Error("Invalid request.");
  await setSetting(key as SettingKey, value === "1", admin.email);
  redirect(`${BACK}?saved=1`);
}

export async function addSourceAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const name = str(form, "name"); const language = str(form, "language"); const category = str(form, "category");
  let url = str(form, "url");
  if (!name || name.length > 80) return fail("Tên nguồn cần từ 1 đến 80 ký tự.");
  if (language !== "en" && language !== "ko") return fail("Ngôn ngữ nguồn không hợp lệ.");
  if (!(articleCategories as readonly string[]).includes(category)) return fail("Chuyên mục mặc định không hợp lệ.");
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error();
    url = parsed.toString();
  } catch { return fail("Link RSS phải là địa chỉ https:// hợp lệ."); }
  if (url.length > 500) return fail("Link RSS quá dài.");
  try { await addSource({ name, url, language, defaultCategory: category as ArticleCategory }, admin.email); } catch (e) {
    if (e instanceof SourceExistsError) return fail("Link RSS này đã có trong danh sách.");
    throw e;
  }
  redirect(`${BACK}?saved=1`);
}

export async function toggleSourceAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(form, "id"); const value = str(form, "value");
  if (!id || (value !== "0" && value !== "1")) throw new Error("Invalid request.");
  await setSourceEnabled(id, value === "1", admin.email);
  redirect(`${BACK}?saved=1`);
}

export async function deleteSourceAction(form: FormData): Promise<void> {
  await assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Invalid request.");
  await deleteSource(id, admin.email);
  redirect(`${BACK}?saved=1`);
}
