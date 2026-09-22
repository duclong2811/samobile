import type { Locale } from "@/lib/i18n/config";

export function formatKrw(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "KRW",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatStorage(capacityGb: number) {
  return capacityGb >= 1024 && capacityGb % 1024 === 0 ? `${capacityGb / 1024}TB` : `${capacityGb}GB`;
}
