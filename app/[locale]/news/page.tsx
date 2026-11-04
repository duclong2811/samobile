import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsListPage } from "@/components/news-pages";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { listPublished } from "@/lib/news/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  return { title: `${m.news.title} | SAmobile`, description: m.news.intro, robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NewsListPage articles={await listPublished(locale)} locale={locale} m={getMessages(locale)} />;
}
