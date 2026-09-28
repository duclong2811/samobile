import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LuckyWheelPage } from "@/components/lucky-wheel-page";
import { isLocale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/lucky-wheel">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getMessages(locale).luckyWheel;
  return { title: `${copy.title} | SAmobile`, description: copy.intro, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[locale]/lucky-wheel">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LuckyWheelPage locale={locale} m={getMessages(locale)} />;
}
