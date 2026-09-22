import Image from "next/image";
import Link from "next/link";
import type { Phone } from "@/content/products/phones";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { formatStorage } from "@/lib/commerce/format";
import { selectableColors } from "@/content/products/phones";
import { Arrow } from "./service-icon";

export function PhoneCard({ phone, locale, m }: { phone: Phone; locale: Locale; m: Messages }) {
  const availableColors = selectableColors(phone);
  return <article className="phone-card" data-phone-id={phone.id}>
    <Link href={`/${locale}/phones/${phone.slug}`} className="phone-card-image" aria-label={`${m.phones.viewPhone}: ${phone.brand} ${phone.model}`}>
      <Image src={phone.media[0].src} width={phone.media[0].width} height={phone.media[0].height} alt={phone.media[0].alt} />
    </Link>
    <div className="phone-card-body">
      <p className="phone-brand">{phone.brand}</p>
      <h3>{phone.model}</h3>
      <div className="phone-card-swatches" aria-label={m.phones.colors}>{availableColors.map(color=><span key={color.id} title={color.name} style={{backgroundColor:color.swatch}} />)}</div>
      <dl className="phone-card-facts">
        <div><dt>{m.phones.storage}</dt><dd>{phone.storageVariants.map((variant) => formatStorage(variant.capacityGb)).join(" · ")}</dd></div>
        <div><dt>{m.phones.colors}</dt><dd>{availableColors.length}</dd></div>
      </dl>
      <p className="phone-starting-price"><span>{m.phones.priceStatus}</span><strong>{m.phones.contactForPrice}</strong></p>
      <Link className="button phone-card-action" href={`/${locale}/phones/${phone.slug}`}>{m.phones.viewPhone}<Arrow /></Link>
    </div>
  </article>;
}
