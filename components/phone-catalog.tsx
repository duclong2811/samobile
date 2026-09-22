"use client";

import { useState } from "react";
import { filterPhones, type Phone, type PhoneBrand } from "@/content/products/phones";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { PhoneCard } from "./phone-card";

type Filter = "all" | PhoneBrand;
export function PhoneCatalog({ phones, locale, m }: { phones:readonly Phone[]; locale:Locale; m:Messages }) {
  const [filter,setFilter]=useState<Filter>("all");
  const shown=filterPhones(phones,filter);
  return <>
    <div className="phone-filters" role="group" aria-label={m.phones.filterLabel}>
      {(["all","Apple","Samsung"] as const).map(value=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==="all"?m.phones.all:value}</button>)}
    </div>
    <p className="phone-result-count" aria-live="polite">{m.phones.resultCount.replace("{count}",String(shown.length))}</p>
    <div className="phone-grid">{shown.map(phone=><PhoneCard key={phone.id} phone={phone} locale={locale} m={m}/>)}</div>
  </>;
}
