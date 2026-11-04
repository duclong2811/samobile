import Link from "next/link";
import { addSourceAction, deleteSourceAction, setSettingAction, toggleSourceAction } from "@/app/admin/ingest-actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { requireAdmin } from "@/lib/admin/auth";
import { categoryLabels, formatDate, ingestStatusLabels } from "@/lib/admin/labels";
import { articleCategories } from "@/lib/news/categories";
import { getSettings, listSources, recentIngest } from "@/lib/news/ingest-repository";

export default async function IngestPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const [settings, sources, log] = await Promise.all([getSettings(), listSources(), recentIngest()]);
  const enabledSources = sources.filter((s) => s.enabled).length;

  return <>
    <header className="page-head"><div><h1>Quét tin tự động</h1>
      <p className="page-sub">Lấy tin từ các nguồn RSS, để AI chọn bài liên quan người nước ngoài, tóm tắt và dịch rồi đăng.</p></div></header>
    {sp.saved && <p className="admin-notice ok" role="status">Đã lưu.</p>}
    {sp.error && <p className="admin-notice error" role="alert">{sp.error}</p>}

    <section className={`panel switch-panel ${settings.ingestEnabled ? "is-on" : ""}`} aria-labelledby="sw-title">
      <div><h2 id="sw-title">Công tắc quét tự động: {settings.ingestEnabled ? "ĐANG BẬT" : "đang tắt"}</h2>
        <p>{settings.ingestEnabled
          ? `Mỗi giờ hệ thống quét ${enabledSources} nguồn đang bật và tự đăng bài phù hợp. Tắt ngay nếu thấy bài sai.`
          : "Hệ thống không quét và không gọi AI. Đây là mặc định an toàn: chỉ bật sau khi đã thêm nguồn và cấu hình DeepSeek."}</p></div>
      <form action={setSettingAction}><input type="hidden" name="key" value="ingest_enabled" /><input type="hidden" name="value" value={settings.ingestEnabled ? "0" : "1"} />
        {settings.ingestEnabled
          ? <ConfirmSubmit className="btn danger" message="Tắt quét tin tự động?">Tắt quét tự động</ConfirmSubmit>
          : <ConfirmSubmit className="btn primary" message="Bật quét tin tự động? Bài phù hợp sẽ được đăng công khai mà không cần duyệt (trừ nhóm nhạy cảm nếu đang giữ lại).">Bật quét tự động</ConfirmSubmit>}
      </form>
    </section>

    <section className="panel switch-panel" aria-labelledby="hold-title">
      <div><h2 id="hold-title">Nhóm nhạy cảm: {settings.holdSensitive ? "giữ lại chờ duyệt" : "tự đăng luôn"}</h2>
        <p>Visa & cư trú, lao động, thuế, y tế & bảo hiểm. {settings.holdSensitive
          ? "Bài thuộc các nhóm này được lưu ở trạng thái Bản nháp để bạn đọc lại rồi mới xuất bản, vì dịch sai có thể gây hại thật cho người đọc."
          : "Cảnh báo: bài các nhóm này sẽ được đăng ngay không qua kiểm tra của con người."}</p></div>
      <form action={setSettingAction}><input type="hidden" name="key" value="hold_sensitive" /><input type="hidden" name="value" value={settings.holdSensitive ? "0" : "1"} />
        {settings.holdSensitive
          ? <ConfirmSubmit className="btn danger" message="Cho phép tự đăng cả visa/lao động/thuế/y tế mà không cần duyệt?">Cho phép tự đăng</ConfirmSubmit>
          : <button type="submit" className="btn primary">Giữ lại chờ duyệt</button>}
      </form>
    </section>

    <section className="panel" aria-labelledby="src-title">
      <h2 id="src-title">Nguồn tin ({sources.length})</h2>
      {sources.length === 0 ? <p className="empty">Chưa có nguồn nào. Thêm link RSS ở form bên dưới.</p> :
        <div className="table-wrap flush"><table className="admin-table">
          <thead><tr><th scope="col">Nguồn</th><th scope="col">Ngôn ngữ</th><th scope="col">Chuyên mục mặc định</th><th scope="col">Lần quét cuối</th><th scope="col"><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>{sources.map((s) => <tr key={s.id}>
            <th scope="row">{s.name}<small>{s.url}</small>{s.lastError && <small className="err-text">Lỗi: {s.lastError}</small>}</th>
            <td>{s.language === "ko" ? "한국어" : "English"}</td><td>{categoryLabels[s.defaultCategory]}</td>
            <td>{formatDate(s.lastRunAt)}<small>{s.enabled ? "Đang bật" : "Đã tắt"}</small></td>
            <td className="row-actions">
              <form action={toggleSourceAction}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="value" value={s.enabled ? "0" : "1"} /><button type="submit" className="btn">{s.enabled ? "Tắt" : "Bật"}</button></form>
              <form action={deleteSourceAction}><input type="hidden" name="id" value={s.id} /><ConfirmSubmit className="btn danger" message={`Xóa nguồn “${s.name}” và nhật ký quét của nó? Các bài đã đăng vẫn giữ nguyên.`}>Xóa</ConfirmSubmit></form>
            </td>
          </tr>)}</tbody>
        </table></div>}

      <form action={addSourceAction} className="source-form">
        <h3>Thêm nguồn</h3>
        <label className="field"><span>Tên nguồn <small>(hiện công khai dưới bài)</small></span><input name="name" required maxLength={80} /></label>
        <label className="field"><span>Link RSS <small>(https://…)</small></span><input name="url" type="url" required maxLength={500} placeholder="https://" /></label>
        <label className="field"><span>Ngôn ngữ của nguồn</span><select name="language" defaultValue="en"><option value="en">English</option><option value="ko">한국어</option></select></label>
        <label className="field"><span>Chuyên mục mặc định</span><select name="category" defaultValue="general">{articleCategories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}</select></label>
        <button type="submit" className="btn primary">Thêm nguồn</button>
        <p className="side-hint">Chỉ lấy tiêu đề và mô tả ngắn mà chính nguồn công bố trong RSS, không tải toàn văn bài. Hãy kiểm tra điều khoản sử dụng của từng nguồn trước khi thêm.</p>
      </form>
    </section>

    <section className="panel" aria-labelledby="log-title">
      <h2 id="log-title">Nhật ký quét gần đây</h2>
      {log.length === 0 ? <p className="empty">Chưa có bài nào được xử lý.</p> :
        <div className="table-wrap flush"><table className="admin-table">
          <thead><tr><th scope="col">Bài gốc</th><th scope="col">Kết quả</th><th scope="col">Lý do</th><th scope="col">Lúc</th></tr></thead>
          <tbody>{log.map((r) => <tr key={r.id}>
            <th scope="row">{r.articleId ? <Link href={`/admin/articles/${r.articleId}`}>{r.title}</Link> : <span>{r.title}</span>}<small>{r.source}</small></th>
            <td><span className={`status ingest-${r.status}`}>{ingestStatusLabels[r.status]}</span></td>
            <td>{r.reason ?? "—"}{r.status === "failed" && <small>lần thử {r.attempts}/3</small>}</td>
            <td>{formatDate(r.at)}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </>;
}
