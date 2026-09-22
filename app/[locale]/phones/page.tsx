import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhonesPage } from "@/components/phones-page";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { phoneRepository } from "@/lib/products/phone-repository";

export async function generateMetadata({ params }: PageProps<"/[locale]/phones">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  return { title: `${m.phones.title} | SAmobile`, description: m.phones.intro, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[locale]/phones">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PhonesPage phones={await phoneRepository.list()} locale={locale} m={getMessages(locale)} />;
}
