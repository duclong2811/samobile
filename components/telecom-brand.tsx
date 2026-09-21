import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export function TelecomBrand({ locale }: { locale: Locale }) {
  return <Link href={`/${locale}`} className="telecom-brand" aria-label="KT">
    <Image src="/brands/kt-logo.png" alt="KT" width={200} height={164} unoptimized className="telecom-logo" />
  </Link>;
}
