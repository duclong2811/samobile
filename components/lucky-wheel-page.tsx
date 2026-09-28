import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { LuckyWheel } from "./lucky-wheel";

export function LuckyWheelPage({ locale, m }: { locale: Locale; m: Messages }) {
  const copy = m.luckyWheel;
  return <>
    <a className="skip-link" href="#main">{m.skip}</a>
    <SiteHeader locale={locale} m={m} interior />
    <main id="main" tabIndex={-1} className="lucky-wheel-main">
      <div className="shell lucky-wheel-breadcrumb"><Link href={`/${locale}`}>{m.phones.home}</Link><span aria-hidden="true">/</span><span>{copy.title}</span></div>
      <section className="shell lucky-wheel-layout" aria-labelledby="lucky-wheel-title">
        <div className="lucky-wheel-copy">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h1 id="lucky-wheel-title">{copy.title}<span className="heading-dot">.</span></h1>
          <p className="lucky-wheel-intro">{copy.intro}</p>
          <div className="lucky-wheel-rules">
            <h2>{copy.prizeTitle}</h2>
            <ul>{copy.prizes.map((prize) => <li key={prize}>{prize}</li>)}</ul>
          </div>
          <p className="lucky-wheel-demo-note"><strong>{copy.demoLabel}</strong> {copy.demoNotice}</p>
        </div>
        <LuckyWheel copy={copy} />
      </section>
    </main>
    <SiteFooter locale={locale} m={m} interior />
  </>;
}

