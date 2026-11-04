import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { categoryLabels, editorLocaleOrder, formatDate, originLabels, statusLabels } from "@/lib/admin/labels";
import { articleStatuses, type ArticleStatus } from "@/lib/admin/validation";
import { listForAdmin } from "@/lib/news/repository";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; deleted?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (articleStatuses as readonly string[]).includes(sp.status ?? "") ? (sp.status as ArticleStatus) : undefined;
  const q = (sp.q ?? "").trim().slice(0, 100) || undefined;
  const rows = await listForAdmin({ status, q });
  const tab = (label: string, value?: ArticleStatus) => <Link key={label} href={value ? `/admin/articles?status=${value}` : "/admin/articles"} aria-current={status === value ? "page" : undefined}>{label}</Link>;

  return <>
    <header className="page-head"><h1>Bài viết</h1><Link className="btn primary" href="/admin/articles/new">Viết bài mới</Link></header>
    {sp.deleted && <p className="admin-notice ok" role="status">Đã xóa bài.</p>}
    <div className="toolbar">
      <nav className="filter-tabs" aria-label="Lọc theo trạng thái">{tab("Tất cả")}{articleStatuses.map((s) => tab(statusLabels[s], s))}</nav>
      <form role="search" className="search-form" action="/admin/articles">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="sr-only" htmlFor="q">Tìm bài viết</label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Tìm theo tiêu đề hoặc slug" />
      </form>
    </div>
    {rows.length === 0 ? <p className="empty panel">Không có bài viết nào{q ? " khớp tìm kiếm" : ""}. <Link href="/admin/articles/new">Viết bài mới</Link></p> :
      <div className="table-wrap"><table className="admin-table">
        <thead><tr><th scope="col">Tiêu đề</th><th scope="col">Trạng thái</th><th scope="col">Chuyên mục</th><th scope="col">Ngôn ngữ</th><th scope="col">Cập nhật</th></tr></thead>
        <tbody>{rows.map((a) => <tr key={a.id}>
          <th scope="row"><Link href={`/admin/articles/${a.id}`}>{a.title}</Link><small>{originLabels[a.origin]} · /{a.slug}</small></th>
          <td><span className={`status status-${a.status}`}>{statusLabels[a.status]}</span></td>
          <td>{categoryLabels[a.category]}</td>
          <td className="locale-dots">{editorLocaleOrder.map((l) => <span key={l} className={a.locales.includes(l) ? "on" : ""} title={l}>{l}</span>)}</td>
          <td>{formatDate(a.updatedAt)}</td>
        </tr>)}</tbody>
      </table></div>}
  </>;
}
