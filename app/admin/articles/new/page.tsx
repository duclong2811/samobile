import { ArticleEditor } from "@/components/admin/article-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { toEditorValues } from "@/lib/admin/editor-values";

export default async function NewArticlePage() {
  await requireAdmin();
  return <><header className="page-head"><h1>Viết bài mới</h1></header><ArticleEditor initial={toEditorValues(null)} saved={false} /></>;
}
