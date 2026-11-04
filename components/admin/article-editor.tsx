"use client";
import { useActionState, useRef, useState } from "react";
import { deleteArticleAction, saveArticleAction, type FormState } from "@/app/admin/actions";
import { localeNames, type Locale } from "@/lib/i18n/config";
import { articleCategories, articleStatuses, limits } from "@/lib/admin/validation";
import { categoryLabels, editorLocaleOrder, statusLabels } from "@/lib/admin/labels";
import type { EditorValues } from "@/lib/admin/editor-values";
import { ConfirmSubmit } from "./confirm-submit";

const FORM_ID = "article-form";

export function ArticleEditor({ initial, saved }: { initial: EditorValues; saved: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveArticleAction, {});
  const v = state.values ?? initial;
  const isNew = !initial.id;
  const statusRef = useRef<HTMLSelectElement>(null);
  const [active, setActive] = useState<Locale>("vi");
  const [filled, setFilled] = useState<Record<string, boolean>>(() => Object.fromEntries(editorLocaleOrder.map((l) => [l, Boolean(initial[`title_${l}`])])));
  const publicLocale = editorLocaleOrder.find((l) => initial[`title_${l}`]);

  return <div className="editor-grid" key={state.nonce ?? "initial"}>
    <form id={FORM_ID} action={action} className="editor-main"
      onInput={(e) => { const t = e.target as HTMLInputElement; if (t.name?.startsWith("title_")) setFilled((f) => ({ ...f, [t.name.slice(6)]: t.value.trim() !== "" })); }}>
      <input type="hidden" name="id" defaultValue={v.id} />
      {saved && !state.error && <p className="admin-notice ok" role="status">Đã lưu.</p>}
      {state.error && <p className="admin-notice error" role="alert">{state.error}</p>}

      <div className="locale-tabs" role="tablist" aria-label="Ngôn ngữ nội dung">
        {editorLocaleOrder.map((l) => <button key={l} type="button" role="tab" id={`tab-${l}`} aria-selected={active === l} aria-controls={`panel-${l}`}
          className={active === l ? "is-active" : ""} onClick={() => setActive(l)}>
          {localeNames[l]}{filled[l] && <span className="tab-dot" aria-label="đã có nội dung" />}
        </button>)}
      </div>

      {editorLocaleOrder.map((l) => <fieldset key={l} role="tabpanel" id={`panel-${l}`} aria-labelledby={`tab-${l}`} hidden={active !== l} className="locale-panel">
        <legend className="sr-only">{localeNames[l]}</legend>
        <label className="field"><span>Tiêu đề</span>
          <input name={`title_${l}`} defaultValue={v[`title_${l}`]} maxLength={limits.title} lang={l} translate="no" />
        </label>
        <label className="field"><span>Tóm tắt <small>(hiện ở danh sách tin)</small></span>
          <textarea name={`summary_${l}`} defaultValue={v[`summary_${l}`]} rows={3} maxLength={limits.summary} lang={l} />
        </label>
        <label className="field"><span>Nội dung <small>(đoạn văn cách nhau một dòng trống; <code>## </code> tiêu đề; <code>- </code> danh sách)</small></span>
          <textarea name={`body_${l}`} defaultValue={v[`body_${l}`]} rows={16} maxLength={limits.body} lang={l} className="body-input" />
        </label>
        <label className="check"><input type="checkbox" name={`mt_${l}`} defaultChecked={v[`mt_${l}`] === "on"} /> Bản dịch tự động (hiện ghi chú cảnh báo cho người đọc)</label>
      </fieldset>)}
    </form>

    <aside className="editor-side">
      <section className="side-card">
        <h2>Xuất bản</h2>
        <label className="field"><span>Trạng thái</span>
          <select ref={statusRef} name="status" form={FORM_ID} defaultValue={v.status}>{articleStatuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</select>
        </label>
        <div className="side-actions">
          <button type="submit" form={FORM_ID} className="btn primary" disabled={pending}>{pending ? "Đang lưu…" : "Lưu"}</button>
          <button type="submit" form={FORM_ID} name="intent" value="publish" className="btn" disabled={pending} onClick={() => { if (statusRef.current) statusRef.current.value = "published"; }}>Lưu & xuất bản</button>
        </div>
        {!isNew && initial.status === "published" && publicLocale && <p className="side-hint"><a href={`/${publicLocale}/news/${initial.slug}`} target="_blank" rel="noreferrer">Xem bài trên website ↗</a></p>}
      </section>

      <section className="side-card">
        <h2>Thông tin</h2>
        <label className="field"><span>Chuyên mục</span>
          <select name="category" form={FORM_ID} defaultValue={v.category}>{articleCategories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}</select>
        </label>
        <label className="field"><span>Đường dẫn (slug)</span>
          <input name="slug" form={FORM_ID} defaultValue={v.slug} maxLength={limits.slug} placeholder="để trống: tự tạo từ tiêu đề" spellCheck={false} autoCapitalize="none" />
        </label>
        <label className="field"><span>Tên nguồn</span>
          <input name="sourceName" form={FORM_ID} defaultValue={v.sourceName} maxLength={limits.sourceName} />
        </label>
        <label className="field"><span>Link bài gốc</span>
          <input name="sourceUrl" form={FORM_ID} type="url" defaultValue={v.sourceUrl} maxLength={limits.sourceUrl} placeholder="https://" />
        </label>
      </section>

      {!isNew && <section className="side-card danger">
        <h2>Xóa bài</h2>
        <p className="side-hint">Xóa vĩnh viễn bài và mọi bản dịch. Nếu chỉ muốn gỡ khỏi website, hãy đổi trạng thái thành “Đã ẩn”.</p>
        <form action={deleteArticleAction}>
          <input type="hidden" name="id" value={initial.id} />
          <ConfirmSubmit className="btn danger" message="Xóa vĩnh viễn bài này và mọi bản dịch?">Xóa bài</ConfirmSubmit>
        </form>
      </section>}
    </aside>
  </div>;
}
