"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo,useState } from "react";
import { hasVerifiedPrice,resolvePhoneMedia,selectableColors,type FinancingConfiguration,type Phone } from "@/content/products/phones";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { calculateFinancing } from "@/lib/commerce/financing";
import { formatKrw,formatStorage } from "@/lib/commerce/format";
import { Arrow } from "./service-icon";

export function PhoneProduct({phone,financing,locale,m}:{phone:Phone;financing:FinancingConfiguration;locale:Locale;m:Messages}){
  const availableColors=selectableColors(phone);
  const [storageId,setStorageId]=useState(phone.storageVariants[0].id);
  const [colorId,setColorId]=useState(availableColors[0].id);
  const [months,setMonths]=useState(financing.termsMonths[0]);
  const selectedStorage=phone.storageVariants.find(item=>item.id===storageId)??phone.storageVariants[0];
  const selectedColor=availableColors.find(item=>item.id===colorId)??availableColors[0];
  const image=resolvePhoneMedia(phone,selectedColor.id);
  const priceVerified=hasVerifiedPrice(phone)&&selectedStorage.priceKrw!==null;
  const estimate=useMemo(()=>priceVerified?calculateFinancing(selectedStorage.priceKrw!,financing.annualRateBasisPoints,months):null,[selectedStorage.priceKrw,financing.annualRateBasisPoints,months,priceVerified]);
  const rate=financing.annualRateBasisPoints/100;
  const query=new URLSearchParams({phone:`${phone.brand} ${phone.model}`,storage:formatStorage(selectedStorage.capacityGb),color:selectedColor.name,priceStatus:phone.commercialVerificationStatus});
  if(estimate){query.set("term",String(months));query.set("priceKrw",String(selectedStorage.priceKrw));query.set("monthlyEstimateKrw",String(estimate.monthlyPaymentKrw));}
  return <div className="phone-product" data-phone-id={phone.id}>
    <div className="phone-product-media"><Image key={image.id} src={image.src} width={image.width} height={image.height} priority alt={image.alt}/><p>{m.phones.imageUsageNote}</p></div>
    <div className="phone-configurator">
      <p className="phone-brand">{phone.brand}</p><h1>{phone.model}</h1>
      <p className="selected-device-price"><span>{m.phones.devicePrice}</span><strong data-testid="device-price">{priceVerified?formatKrw(selectedStorage.priceKrw!,locale):m.phones.contactForPrice}</strong></p>
      <fieldset><legend>{m.phones.storage}</legend><div className="variant-options">{phone.storageVariants.map(item=><button key={item.id} type="button" aria-pressed={item.id===selectedStorage.id} onClick={()=>setStorageId(item.id)}>{formatStorage(item.capacityGb)}</button>)}</div></fieldset>
      <fieldset><legend>{m.phones.color}: <strong>{selectedColor.name}</strong></legend><div className="variant-options color-options">{availableColors.map(item=><button key={item.id} type="button" aria-pressed={item.id===selectedColor.id} onClick={()=>setColorId(item.id)}><span className="color-swatch" style={{backgroundColor:item.swatch}} aria-hidden="true"/>{item.name}</button>)}</div></fieldset>
      {priceVerified&&<fieldset><legend>{m.phones.installment}</legend><div className="variant-options term-options">{financing.termsMonths.map(term=><button key={term} type="button" aria-pressed={term===months} onClick={()=>setMonths(term)}>{m.phones.months.replace("{months}",String(term))}</button>)}</div></fieldset>}
      {estimate?<section className="financing-summary" aria-live="polite" aria-labelledby="financing-title"><p className="section-kicker" id="financing-title">{m.phones.estimate}</p><p className="monthly-payment"><strong data-testid="monthly-payment">{formatKrw(estimate.monthlyPaymentKrw,locale)}</strong><span>{m.phones.perMonth}</span></p><dl><div><dt>{m.phones.devicePrice}</dt><dd>{formatKrw(estimate.principalKrw,locale)}</dd></div><div><dt>{m.phones.annualInterest}</dt><dd>{rate}%</dd></div><div><dt>{m.phones.installmentTerm}</dt><dd>{m.phones.months.replace("{months}",String(months))}</dd></div><div><dt>{m.phones.interestAmount}</dt><dd>{formatKrw(estimate.interestKrw,locale)}</dd></div><div><dt>{m.phones.totalPayment}</dt><dd>{formatKrw(estimate.totalPaymentKrw,locale)}</dd></div></dl><p className="financing-disclaimer">{m.phones.disclaimer.replace("{rate}",String(rate))}</p></section>:<section className="price-consultation-state"><h2>{m.phones.priceRequiredTitle}</h2><p>{m.phones.priceRequiredBody}</p><p>{m.phones.financingUnavailable}</p></section>}
      <Link className="button phone-inquiry" href={`/${locale}/?${query.toString()}#consultation`}>{m.phones.inquiry}<Arrow/></Link><p className="selection-note">{m.phones.selectionPreserved}</p>
      <section className="phone-specifications" aria-labelledby="specifications-title"><h2 id="specifications-title">{m.phones.keySpecifications}</h2><dl>{phone.specifications.map(spec=><div key={spec.key}><dt>{m.phones.specificationLabels[spec.key]}</dt><dd>{spec.value}</dd></div>)}</dl><p>{m.phones.manufacturerSource} <a href={phone.source.url} target="_blank" rel="noreferrer">{phone.source.manufacturer}</a> · {phone.source.dateChecked}</p></section>
    </div>
  </div>;
}
