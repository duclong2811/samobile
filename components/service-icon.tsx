import type { ProductCategory } from "@/content/products/plans";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} /></svg>;
}

export function ServiceIcon({ type }: { type: ProductCategory }) {
  return <svg aria-hidden="true" width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {type === "mobile" && <><rect x="11" y="3" width="18" height="34" rx="3"/><path d="M17 7h6M18 32h4"/></>}
    {type === "internet" && <><rect x="5" y="24" width="30" height="11" rx="2"/><path d="M10 24v-8m20 8v-8M11 10a14 14 0 0 1 18 0M15 15a8 8 0 0 1 10 0M20 20h.01M26 29h4M10 29h.01"/></>}
    {type === "tv" && <><rect x="3" y="7" width="34" height="24" rx="2"/><path d="M14 36h12m-6-5v5m-3-23 9 6-9 6Z"/></>}
    {type === "sim" && <><path d="M11 3h15l7 8v26H7V7a4 4 0 0 1 4-4Z"/><rect x="13" y="17" width="14" height="13" rx="2"/><path d="M20 17v13m-7-7h14"/></>}
  </svg>;
}
