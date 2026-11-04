import Link from "next/link";
import { sensitiveCategories } from "@/lib/admin/validation";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import type { PublicArticle } from "@/lib/news/repository";
import { RichText } from "./rich-text";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const formatDate = (iso: string, locale: Locale) => new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });

function Shell({ locale, m, children }: { locale: Locale; m: Messages; children: React.ReactNode }) {
  return <>
    <a className="skip-link" href="#main">{m.skip}</a>
    <SiteHeader locale={locale} m={m} interior />
    <main id="main" tabIndex={-1}>{children}</main>
    <SiteFooter locale={locale} m={m} interior />
  </>;
}

export function NewsListPage({ articles, locale, m }: { articles: PublicArticle[]; locale: Locale; m: Messages }) {
  return <Shell locale={locale} m={m}>
    <header className="phones-hero"><div className="shell">
      <nav aria-label={m.news.breadcrumb}><Link href={`/${locale}`}>{m.news.home}</Link><span aria-hidden="true">/</span><span>{m.news.title}</span></nav>
      <h1>{m.news.title}<span className="heading-dot">.</span></h1>
      <p>{m.news.intro}</p>
    </div></header>
    <section className="section-space"><div className="shell news-list">
      {articles.length === 0 ? <p>{m.news.empty}</p> : articles.map((a) => <article key={a.slug} className="news-item">
        <p className="news-meta"><span>{m.news.categories[a.category]}</span><time dateTime={a.publishedAt}>{formatDate(a.publishedAt, locale)}</time></p>
        <h2><Link href={`/${locale}/news/${a.slug}`}>{a.title}</Link></h2>
        {a.summary && <p>{a.summary}</p>}
      </article>)}
    </div></section>
  </Shell>;
}

export function NewsArticlePage({ article, locale, m }: { article: PublicArticle; locale: Locale; m: Messages }) {
  return <Shell locale={locale} m={m}>
    <article className="news-article"><div className="shell">
      <p className="news-back"><Link href={`/${locale}/news`}>{m.news.back}</Link></p>
      <p className="news-meta"><span>{m.news.categories[article.category]}</span><span>{m.news.publishedOn} <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time></span></p>
      <h1>{article.title}</h1>
      {article.summary && <p className="news-lead">{article.summary}</p>}
      {article.machineTranslated && <p className="news-notice" role="note">{m.news.machineNotice}</p>}
      <div className="news-body"><RichText text={article.body} /></div>
      {(article.sourceUrl || article.sourceName) && <p className="news-source">
        {m.news.source}: {article.sourceUrl
          ? <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{article.sourceName ?? m.news.readOriginal} ↗</a>
          : article.sourceName}
      </p>}
      {sensitiveCategories.includes(article.category) && <p className="news-notice" role="note">{m.news.disclaimer}</p>}
    </div></article>
  </Shell>;
}
