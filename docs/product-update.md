# Homepage product update

The current user request authorizes homepage implementation and preserves the existing visual baseline, superseding the historical documentation-only phase in the original planning docs. No additional pages or integrations are authorized by this update.

Mobile and Internet products live in `content/products/mobile-plans.ts` and `internet-plans.ts`. Shared discriminated types and source metadata live in `plans.ts`. Numeric facts are stored only in these product records, including GB allowances, daily GB, post-allowance Mbps, calls/minutes, SMS/messages, Internet Mbps and contract months. A-D are temporary identifiers, not official product names. Prices are KRW per month. Internet contract years are derived from months.

Source: SAmobile-provided, verificationStatus: agency-provided, lastVerified: null. These are agency-supplied facts, not independently verified KT corporate data. Never infer taxes, installation/router fees, discounts, eligibility or cancellation terms.

Locale messages contain labels and formatting templates, not commercial numbers. Plan cards share the existing consultation anchor. Consultation destinations remain disabled in `content/consultation.ts` until supplied; no request is submitted.

The native modal requires explicit choice on first visit; Escape cannot dismiss it before a choice. After a preference exists, Escape and the close button dismiss the header selector and restore trigger focus. Local storage persists the preference; browser language never overrides it. If storage is blocked, an in-memory choice lasts for the current client session only. All seven locales (ko/en/vi/zh/th/ne/uz) now have complete messages and selectable destinations; there are no coming-soon language options.

Current service scope: mobile plans and home Internet installation only. Navigation, shortcuts and product groups use these two categories. SIM/eSIM remains secondary information under mobile, not a third primary service. The former television category and bundle promotion are removed from customer-facing content. Supplied plan values remain unchanged.

The authorized KT asset and current header/footer treatment are documented in `brand-assets.md`. The hero uses `public/images/mobile-internet-concept.png`, edited with the built-in image_gen tool to remove the television while preserving the existing concept composition. Its prompt is saved alongside it; the old image/prompt are historical source assets, not referenced by the website.

TBD: official product names; unsupplied charges/conditions and taxes; independent verification; business/legal details; consultation channels and backend.
