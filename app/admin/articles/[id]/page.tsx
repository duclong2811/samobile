import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { toEditorValues } from "@/lib/admin/editor-values";
import { formatDate, statusLabels } from "@/lib/admin/labels";
import { getForAdmin } from "@/lib/news/repository";

export default async function EditArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const article = await getForAdmin(id);
  if (!article) notFound();
  const sp = await searchParams;
  return <>
    <header className="page-head"><div><h1>Sửa bài viết</h1>
      <p className="page-sub">{statusLabels[article.status]}{article.publishedAt ? ` · xuất bản ${formatDate(article.publishedAt)}` : ""}</p></div></header>
    <ArticleEditor initial={toEditorValues(article)} saved={sp.saved === "1"} />
  </>;
}
