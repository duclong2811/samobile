import { TelecomBrand } from "./telecom-brand";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { LanguageSelector } from "./language-selector";
import { MobileNavigation } from "./mobile-navigation";
import { ContactIcon } from "./ui-icons";
import { Arrow } from "./service-icon";

export const navigationTargets = ["#mobile", "#internet", "#promotions", "#support"];

export function SiteHeader({ locale, m }: { locale: Locale; m: Messages }) {
  return <header className="site-header">
    <div className="utility-bar"><div className="shell utility-inner">
      <span>{m.agencyShort}</span><a href="#process">{m.processTitle}<Arrow /></a>
    </div></div>
    <div className="shell masthead">
      <div className="brand-group"><TelecomBrand locale={locale} /></div>
      <div className="header-actions">
        <a href="#consultation" className="header-consult"><ContactIcon type="chat" /><span>{m.consult}</span></a>
        <LanguageSelector locale={locale} copy={m.languageDialog} />
      </div>
    </div>
    <div className="nav-bar"><div className="shell nav-inner">
      <a className="all-services" href="#services"><span aria-hidden="true">☰</span>{m.allServices}</a>
      <nav aria-label={m.navigation} className="primary-nav">
        {m.nav.map((label, index) => <a href={navigationTargets[index]} key={label}>{label}</a>)}
        <a className="nav-consult" href="#consultation">{m.consult}<Arrow /></a>
      </nav>
      <MobileNavigation m={m} targets={navigationTargets}/>
    </div></div>
  </header>;
}
