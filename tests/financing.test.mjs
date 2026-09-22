import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { calculateFinancing } from "../lib/commerce/financing.ts";
import { filterPhones, hasVerifiedPrice, phones, resolvePhoneMedia, selectableColors } from "../content/products/phones.ts";

assert.deepEqual(calculateFinancing(1_200_000, 600, 6), {
  principalKrw: 1_200_000, annualRateBasisPoints: 600, months: 6,
  interestKrw: 36_000, totalPaymentKrw: 1_236_000, monthlyPaymentKrw: 206_000,
});
assert.deepEqual(calculateFinancing(1_200_000, 600, 12), {
  principalKrw: 1_200_000, annualRateBasisPoints: 600, months: 12,
  interestKrw: 72_000, totalPaymentKrw: 1_272_000, monthlyPaymentKrw: 106_000,
});
assert.equal(calculateFinancing(1_000_001, 600, 12).monthlyPaymentKrw, 88_333);
assert.equal(filterPhones(phones,"Apple").length,5);
assert.equal(filterPhones(phones,"Samsung").length,5);
assert(phones.every(phone=>!hasVerifiedPrice(phone)),"Unknown SAmobile prices must not enable financing");
assert(phones.every(phone=>phone.storageVariants.length>0&&phone.storageVariants.every(item=>item.id.startsWith(phone.id))),"Storage variants must remain product-specific");
assert(phones.every(phone=>selectableColors(phone).every(item=>item.availability==="standard")),"Exclusive colors must not be selectable");
assert(phones.every(phone=>selectableColors(phone).every(color=>resolvePhoneMedia(phone,color.id)?.id===color.id)),"Every selectable color must resolve to its matching image");
assert(phones.every(phone=>phone.media.every(item=>item.source==="manufacturer"&&item.usageStatus==="reference-only"&&item.sourceUrl)),"Manufacturer images must retain provenance and reference-only status");
await Promise.all(phones.flatMap(phone=>phone.media.map(item=>access(`public${item.src}`))));
assert(phones.every(phone=>resolvePhoneMedia(phone,"missing-color")===phone.media[0]),"Missing color image must fall back to primary media");
assert(phones.every(phone=>phone.id&&phone.slug&&phone.source.url&&phone.source.dateChecked&&phone.media.length&&phone.specifications.length),"Repository records must satisfy the product contract");
console.log("PASS financing, catalog filtering, price guard, variants, color availability, media fallback and contract");
