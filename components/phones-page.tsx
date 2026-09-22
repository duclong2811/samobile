import Link from "next/link";
import type { Phone } from "@/content/products/phones";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PhoneCatalog } from "./phone-catalog";
import { Arrow } from "./service-icon";

export function PhonesPage({ phones, locale, m }: { phones: readonly Phone[]; locale: Locale; m: Messages }) {
  return <>
    <a className="skip-link" href="#main">{m.skip}</a>
    <SiteHeader locale={locale} m={m} interior />
    <main id="main" tabIndex={-1}>
      <header className="phones-hero"><div className="shell">
        <nav aria-label={m.phones.breadcrumb}><Link href={`/${locale}`}>{m.phones.home}</Link><span aria-hidden="true">/</span><span>{m.phones.title}</span></nav>
        <p className="section-kicker">{m.phones.eyebrow}</p>
        <h1>{m.phones.title}<span className="heading-dot">.</span></h1>
        <p>{m.phones.intro}</p>
        <p className="fixture-notice">{m.phones.catalogNotice}</p>
      </div></header>
      <section className="phone-listing section-space" aria-labelledby="phone-list-title"><div className="shell">
        <div className="section-heading"><div><h2 id="phone-list-title">{m.phones.browse}</h2><p>{m.phones.compareIntro}</p></div></div>
        {phones.length ? <PhoneCatalog phones={phones} locale={locale} m={m}/> : <p>{m.phones.empty}</p>}
        <Link href={`/${locale}/#consultation`} className="text-link phone-list-consult">{m.phones.generalConsultation}<Arrow /></Link>
      </div></section>
    </main>
    <SiteFooter locale={locale} m={m} interior />
  </>;
}
