import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { phoneFinancing, phones } from "@/content/products/phones";
import { PhoneProduct } from "@/components/phone-product";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { phoneRepository } from "@/lib/products/phone-repository";

export function generateStaticParams() { return locales.flatMap((locale) => phones.map((phone) => ({ locale, slug: phone.slug }))); }

export async function generateMetadata({ params }: PageProps<"/[locale]/phones/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const phone = await phoneRepository.findBySlug(slug);
  if (!phone) notFound();
  return { title: `${phone.brand} ${phone.model} | SAmobile`, description: getMessages(locale).phones.demoNotice, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[locale]/phones/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const phone = await phoneRepository.findBySlug(slug);
  if (!phone) notFound();
  const m = getMessages(locale);
  return <><a className="skip-link" href="#main">{m.skip}</a><SiteHeader locale={locale} m={m} interior /><main id="main" tabIndex={-1} className="phone-detail-main"><div className="shell phone-breadcrumb"><Link href={`/${locale}`}>{m.phones.home}</Link><span>/</span><Link href={`/${locale}/phones`}>{m.phones.title}</Link><span>/</span><span>{phone.model}</span></div><div className="shell"><PhoneProduct phone={phone} financing={phoneFinancing} locale={locale} m={m} /></div></main><SiteFooter locale={locale} m={m} interior /></>;
}
