import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticlePage } from "@/components/news-pages";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublished } from "@/lib/news/repository";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getPublished(locale, slug);
  if (!article) notFound();
  return { title: `${article.title} | SAmobile`, description: article.summary || undefined, robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getPublished(locale, slug);
  if (!article) notFound();
  return <NewsArticlePage article={article} locale={locale} m={getMessages(locale)} />;
}
