import type { ArticleCategory, ArticleStatus } from "./validation";

// Admin UI copy (Vietnamese, for the site owner). Kept out of components on purpose.
export const statusLabels: Record<ArticleStatus, string> = { draft: "Bản nháp", published: "Đã xuất bản", hidden: "Đã ẩn" };
export const categoryLabels: Record<ArticleCategory, string> = {
  general: "Tin chung", visa: "Visa & cư trú", labor: "Lao động", tax: "Thuế", health: "Y tế & bảo hiểm", life: "Đời sống",
};
export const originLabels = { manual: "Thủ công", auto: "Tự động" } as const;
/** Editor tab order: launch languages first. */
export const editorLocaleOrder = ["vi", "ne", "th", "uz", "en", "ko", "zh"] as const;
export const actionLabels: Record<string, string> = { create: "Tạo mới", update: "Sửa", status: "Đổi trạng thái", delete: "Xóa", setting: "Đổi cài đặt" };
export const ingestStatusLabels = { published: "Đã đăng", held: "Chờ duyệt", skipped: "Bỏ qua", failed: "Lỗi" } as const;

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" });
}
