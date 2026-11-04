import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { actionLabels, formatDate, statusLabels } from "@/lib/admin/labels";
import { countByStatus, listForAdmin, recentAudit } from "@/lib/news/repository";

export default async function AdminHome() {
  await requireAdmin();
  const [counts, latest, audit] = await Promise.all([countByStatus(), listForAdmin({}), recentAudit()]);
  return <>
    <header className="page-head"><h1>Tổng quan</h1><Link className="btn primary" href="/admin/articles/new">Viết bài mới</Link></header>
    <div className="stat-row">
      {(["published", "draft", "hidden"] as const).map((s) => <Link key={s} href={`/admin/articles?status=${s}`} className="stat">
        <strong>{counts[s]}</strong><span>{statusLabels[s]}</span></Link>)}
    </div>
    <div className="two-col">
      <section className="panel"><h2>Bài mới cập nhật</h2>
        {latest.length === 0 ? <p className="empty">Chưa có bài viết nào.</p> : <ul className="plain-list">
          {latest.slice(0, 6).map((a) => <li key={a.id}><Link href={`/admin/articles/${a.id}`}>{a.title}</Link><span>{statusLabels[a.status]} · {formatDate(a.updatedAt)}</span></li>)}
        </ul>}
      </section>
      <section className="panel"><h2>Hoạt động gần đây</h2>
        {audit.length === 0 ? <p className="empty">Chưa có hoạt động.</p> : <ul className="plain-list">
          {audit.map((e, i) => <li key={i}><span>{actionLabels[e.action] ?? e.action}{e.detail ? ` — ${e.detail}` : ""}</span><span>{e.actor} · {formatDate(e.at)}</span></li>)}
        </ul>}
      </section>
    </div>
    <section className="panel muted"><h2>Quét tin tự động</h2><p>Chưa bật. Đây là giai đoạn tiếp theo: lấy tin từ báo/cổng chính phủ, tóm tắt, dịch sang Việt – Nepal – Thái – Uzbekistan và lưu vào mục Bài viết.</p></section>
  </>;
}
