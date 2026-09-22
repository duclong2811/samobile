# Smartphone catalog sources

Checked: 2026-09-22. Manufacturer facts below come from official Korean manufacturer pages. SAmobile prices, stock, promotions, subsidies, availability and contract terms remain unverified/TBD for every record.

| Manufacturer | Model | Official source | Verified fields |
| --- | --- | --- | --- |
| Apple | iPhone 18 Pro | https://www.apple.com/kr/iphone-18-pro/specs/ | model, 256/512GB/1/2TB, Black/Silver/Glacier/Burgundy, display, camera, weight, battery |
| Apple | iPhone 18 Pro Max | https://www.apple.com/kr/iphone-18-pro/specs/ | model, 256/512GB/1/2TB, Black/Silver/Glacier/Burgundy, display, camera, weight, battery |
| Apple | iPhone 17 | https://www.apple.com/kr/iphone-17/specs/ | model, 256/512GB, Black/White/Mist Blue/Sage/Lavender, display, camera, weight |
| Apple | iPhone Air | https://www.apple.com/kr/iphone-air/specs/ | model, 256/512GB/1TB, Sky Blue/Light Gold/Cloud White/Space Black, display, camera, battery, eSIM |
| Apple | iPhone 17e | https://www.apple.com/kr/iphone-17e/specs/ | model, 256/512GB, Black/White/Soft Pink, display, weight |
| Samsung | Galaxy S26 | https://www.samsung.com/sec/smartphones/galaxy-s26/specs/ | model, 256/512GB, colors and exclusivity, display, camera, weight, battery, connectivity |
| Samsung | Galaxy S26+ | https://www.samsung.com/sec/smartphones/galaxy-s26/specs/ | model, 256/512GB, colors and exclusivity, display, camera, weight, battery |
| Samsung | Galaxy S26 Ultra | https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/ | model, 256/512GB/1TB, display, camera, weight, battery |
| Samsung | Galaxy Z Flip8 | https://org-sec-b2c.samsung.com/sec/smartphones/galaxy-z-flip8/specs/ | model, 256/512GB, Pink/Graphite/Cream, Mint exclusive, displays, camera, weight, battery |
| Samsung | Galaxy Z Fold8 | https://org-sec-b2c.samsung.com/sec/smartphones/galaxy-z-fold8/ | model, 256/512GB/1TB, Lavender/Graphite/Cream, Pistachio exclusive, camera, weight |

Samsung.com/Samsung Gangnam-only colors are retained as manufacturer reference data with `manufacturer-exclusive` status and are excluded from customer selectors. This does not imply that any standard color is stocked by SAmobile.

## Media provenance

For the internal catalog demo, selectable colors now use product renders downloaded directly from Apple Store CDN or Samsung Korea image CDN on 2026-09-22. Each `PhoneMedia` record is marked `source: manufacturer` and `usageStatus: reference-only`, retains the official product page, and is associated to its color through `imageId`. Manufacturer-exclusive colors were not downloaded or exposed as selectable.

The asset layout and download-source methodology are documented in `public/products/README.md`. The neutral project SVGs remain as fallback assets. Public CDN access is not treated as commercial republication permission; before public release, SAmobile must provide authorized assets or written approval and the media status must be reviewed.

## Maintenance and CMS mapping

Manufacturer facts and SAmobile commercial data are separate. A future Payload `phones` collection can map identity, manufacturer source, specs and commercial verification status; storage variants and colors can be arrays or related collections; media should use Payload media relationships. Only `price-verified` records with non-null prices may enable financing.
