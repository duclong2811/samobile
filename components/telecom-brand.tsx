import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

// Plain temporary text, not an unofficial logo. See docs/brand-assets.md.
export function TelecomBrand({ locale, placeholderLabel }: { locale: Locale; placeholderLabel: string }) {
  return <Link href={`/${locale}`} className="telecom-brand" aria-label={`KT - ${placeholderLabel}`}>
    <span className="telecom-logo-slot">KT</span><small>{placeholderLabel}</small>
  </Link>;
}
