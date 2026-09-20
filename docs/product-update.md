# Homepage product update

The current user request authorizes homepage implementation and preserves the existing visual baseline, superseding the historical documentation-only phase in the original planning docs. No additional pages or integrations are authorized by this update.

Mobile and Internet products live in `content/products/mobile-plans.ts` and `internet-plans.ts`. Shared discriminated types and source metadata live in `plans.ts`. Numeric facts are stored only in these product records, including GB allowances, daily GB, post-allowance Mbps, calls/minutes, SMS/messages, Internet Mbps and contract months. A-D are temporary identifiers, not official product names. Prices are KRW per month. Internet contract years are derived from months.

Source: SAmobile-provided, verificationStatus: agency-provided, lastVerified: null. These are agency-supplied facts, not independently verified KT corporate data. Never infer taxes, installation/router fees, discounts, eligibility or cancellation terms.

Locale messages contain labels and formatting templates, not commercial numbers. Plan cards share the existing consultation anchor. Consultation destinations remain disabled in `content/consultation.ts` until supplied; no request is submitted.

The native modal requires explicit choice on first visit; Escape cannot dismiss it before a choice. After a preference exists, Escape and the close button dismiss the header selector and restore trigger focus. Local storage persists the preference; browser language never overrides it. If storage is blocked, an in-memory choice lasts for the current client session only. Four future languages remain disabled.

TBD: authorized KT logo and rights; official product names; unsupplied charges/conditions and taxes; independent verification; business/legal details; consultation channels and backend.
