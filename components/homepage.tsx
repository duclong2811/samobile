import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { type ProductCategory } from "@/content/products/plans";
import { mobilePlans } from "@/content/products/mobile-plans";
import { internetPlans } from "@/content/products/internet-plans";
import { promotions } from "@/content/promotions";
import { Arrow, ServiceIcon } from "./service-icon";
import { Globe, ContactIcon } from "./ui-icons";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PlanCard } from "./plan-card";
import { Consultation } from "./consultation";

const categories: ProductCategory[] = ["mobile", "internet", "tv", "sim"];

export function Homepage({ locale, m }: { locale: Locale; m: Messages }) {
  return <>
    <a className="skip-link" href="#main">{m.skip}</a>
    <SiteHeader locale={locale} m={m}/>
    <main id="main" tabIndex={-1}>
      <section className="commerce-hero" aria-labelledby="hero-heading">
        <div className="shell hero-inner">
          <div className="hero-copy"><p className="hero-eyebrow">{m.eyebrow}</p>
            <h1 id="hero-heading">{m.heroTitle}<br/><span>{m.heroAccent}</span></h1>
            <p className="hero-description">{m.heroDescription}</p>
            <div className="hero-actions"><a className="button" href="#plans">{m.heroPrimary}<Arrow/></a><a className="button button-outline" href="#consultation">{m.heroSecondary}<Arrow/></a></div>
            <p className="hero-service-line">{m.heroNote}</p>
          </div>
          <figure className="hero-media"><Image src="/images/telecom-products-concept.png" width={1536} height={1024} preload sizes="(max-width: 760px) 100vw, 55vw" alt={m.visualAlt}/><figcaption>{m.visualPlaceholder}</figcaption></figure>
        </div>
      </section>

      <section id="services" className="service-shortcuts shell" aria-label={m.categoryTitle}>
        {categories.map(category => <a key={category} className={`service-shortcut shortcut-${category}`} href={`#${category}`}>
          <span className="shortcut-icon"><ServiceIcon type={category}/></span><span><strong>{m.categories[category].name}</strong><small>{m.categories[category].description}</small></span><Arrow/>
        </a>)}
      </section>

      <section id="plans" className="plans-section section-space" aria-labelledby="plans-title"><div className="shell">
        <div className="section-heading"><div><h2 id="plans-title">{m.plansTitle}<span className="heading-dot">.</span></h2><p>{m.plansIntro}</p></div><a className="text-link" href="#consultation">{m.consult}<Arrow/></a></div>
        {([{ category: "mobile", plans: mobilePlans }, { category: "internet", plans: internetPlans }] as const).map(group => <section key={group.category} id={group.category} className="product-group" aria-labelledby={`${group.category}-title`}>
          <h3 id={`${group.category}-title`} className="product-group-title">{m.categories[group.category].name}</h3>
          <p className="mobile-scroll-hint">{m.compareHint}<Arrow/></p>
          <div className={`plan-grid ${group.category}-grid`} role="region" aria-label={m.categories[group.category].name} tabIndex={0}>{group.plans.map(plan => <PlanCard key={plan.id} plan={plan} locale={locale} m={m}/>)}</div>
        </section>)}
        <div className="other-services"><p id="sim"><strong>{m.simNote}</strong> {m.simDescription}</p><p id="tv"><strong>{m.categories.tv.name}</strong> &mdash; {m.tbd}. <a className="text-link" href="#consultation">{m.consult}<Arrow/></a></p></div>
        <p className="disclosure"><span aria-hidden="true">ⓘ</span>{m.planNotice}</p>
      </div></section>

      <section id="promotions" className="promotions-section section-space" aria-labelledby="promotions-title"><div className="shell">
        <div className="section-heading"><div><h2 id="promotions-title">{m.promotions}</h2><p>{m.promotionsNote}</p></div></div>
        <div className="promotions-grid">{promotions.map(promotion => <article key={promotion.id} className={`promotion-banner promotion-${promotion.id}`}>
          <span className="promotion-placeholder">{m.placeholder}</span><h3>{m.promotionTitles[promotion.id]}</h3><p>{m.promotionDescriptions[promotion.id]}</p>
          <span className="promotion-device" aria-hidden="true"><ServiceIcon type={promotion.category}/></span>
          <a href="#consultation" className="text-link">{m.promotionAction}<Arrow/></a>
        </article>)}</div>
      </div></section>

      <section id="support" className="support-section section-space" aria-labelledby="support-title"><div className="shell">
        <div className="support-banner"><div className="support-heading"><span className="support-globe"><Globe/></span><div><p className="section-kicker">{m.supportEyebrow}</p><h2 id="support-title">{m.supportTitle}</h2></div></div>
          <div className="support-language-block"><p>{m.supportLanguages}</p><div className="language-names"><span lang="ko">한국어</span><span lang="en">English</span><span lang="vi">Tiếng Việt</span></div><small>{m.supportNote}</small></div>
        </div>
        <p className="support-description">{m.supportDescription}</p>
        <div className="support-reasons">{m.reasons.map((reason,i) => <article key={reason.title}><span className="reason-icon">{i===0 ? <ServiceIcon type="mobile"/> : i===1 ? <ServiceIcon type="internet"/> : <ContactIcon type="chat"/>}</span><div><h3>{reason.title}</h3><p>{reason.body}</p></div></article>)}</div>
      </div></section>

      <section id="process" className="process-section section-space" aria-labelledby="process-title"><div className="shell">
        <div className="section-heading"><div><h2 id="process-title">{m.processTitle}</h2></div></div>
        <ol className="process-list">{m.steps.map((step,i) => <li key={step.title}><span className="step-number">{i+1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div>{i<2 && <span className="step-arrow"><Arrow/></span>}</li>)}</ol><p className="process-note">{m.processNote}</p>
      </div></section>
      <Consultation m={m}/>
    </main>
    <SiteFooter locale={locale} m={m}/>
  </>;
}
