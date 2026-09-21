import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import Link from "next/link";
import { navigationTargets } from "./site-header";
import { TelecomBrand } from "./telecom-brand";

export function SiteFooter({ locale, m }: { locale: Locale; m: Messages }) {
  return <footer className="site-footer">
    <div className="footer-nav"><nav className="shell" aria-label={m.footerServices}>{m.nav.map((name,i) => <a key={name} href={navigationTargets[i]}>{name}</a>)}<a href="#consultation">{m.consult}</a></nav></div>
    <div className="shell footer-main"><div className="footer-identity"><div className="footer-cobrand"><TelecomBrand locale={locale}/><Link href={`/${locale}`} className="agency-wordmark" aria-label="SAmobile" translate="no"><span>SA</span>mobile</Link></div><p>{m.footerAgency}</p></div>
      <div><h2>{m.footerInfo}</h2><p>{m.footerBusiness}</p><p>{m.footerLegal}</p></div>
      <div><h2>{m.nav[3]}</h2><ul>{m.supportLinks.map((label,i) => <li key={label}><a href={["#support", "#process", "#availability"][i]}>{label}</a></li>)}</ul></div>
    </div>
    <div className="shell footer-bottom"><p>{m.footerCopyright}</p><p>{m.footerNote}</p></div>
  </footer>;
}
