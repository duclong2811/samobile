# Kiến trúc

## Hiện trạng

Cập nhật triển khai: App Router dùng một homepage chung với bảy bộ thông điệp ko/en/vi/zh/th/ne/uz trong `messages/`. `lib/i18n/config.ts` là nguồn locale; `messages.ts` kiểm tra cấu trúc thông điệp qua TypeScript. `/` chuyển tới `/en`, lựa chọn lưu trong localStorage được tôn trọng. Các phần “chưa triển khai” bên dưới là đề xuất lịch sử; xem `product-update.md` và `brand-assets.md` cho trạng thái hiện tại.

Next.js 16.3.5 App Router, React 19.2.8, TypeScript strict, Tailwind CSS 4, ESLint 9, npm. `app/` chứa layout/trang/CSS mẫu; `public/` chứa tài nguyên. Alias `@/*` trỏ về gốc repository. Chưa có i18n, kho dữ liệu sản phẩm, backend riêng, CMS hoặc bộ kiểm thử.

## Cấu trúc đề xuất, chưa triển khai

Giữ một ứng dụng Next.js đơn giản. Không thêm monorepo, database, CMS hoặc lớp dịch vụ tổng quát khi chưa có nhu cầu.

```text
app/[locale]/        # Một cây trang dùng chung cho các locale
components/          # Component theo nhu cầu thực tế
content/products/    # Dữ liệu sản phẩm và thông tin xác minh
messages/            # Nội dung dịch theo locale
lib/i18n/            # Cấu hình, kiểm tra locale và tải nội dung
```

Tên file, JSON/TypeScript và thư viện i18n: TBD. Có thể bắt đầu với dữ liệu trong repository; chỉ thêm hệ thống ngoài khi yêu cầu vận hành đòi hỏi.

## Locale và routing

- Tiền tố đang hỗ trợ: `/ko`, `/en`, `/vi`, `/zh`, `/th`, `/ne`, `/uz`.
- Dùng `[locale]` thay vì sao chép component cho mỗi ngôn ngữ.
- Slug chung: `/{locale}/mobile`, `/{locale}/internet`; slug các khu vực khác TBD.
- Cấu hình trung tâm phân biệt locale dự kiến và đã xuất bản. Thêm ngôn ngữ bằng cấu hình, bản dịch và QA, không thiết kế lại trang.
- Kiểm tra locale tại biên routing; không dùng chuỗi URL tùy ý làm đường dẫn đọc nội dung.
- Bộ chọn ngôn ngữ nên giữ trang tương ứng khi có bản dịch. Hành vi `/`, locale không hợp lệ, trang thiếu dịch và fallback: TBD.
- Khi triển khai, đặt `lang`, metadata và liên kết ngôn ngữ theo nội dung đã xuất bản. Canonical/indexing cần chốt theo domain và phạm vi phát hành.

## Ranh giới dữ liệu

- Sản phẩm giữ ID, giá trị thương mại, điều kiện và bằng chứng xác minh; bản dịch tham chiếu cùng ID.
- Nội dung locale giữ nhãn/mô tả; component nhận dữ liệu và nội dung để hiển thị.
- Không hardcode giá, khuyến mại, hợp đồng, giấy tờ hoặc eligibility vào JSX, không nhân bản dữ kiện giữa locale.
- Trạng thái TBD phải rõ để dữ liệu thiếu không trở thành giá hoặc lời hứa.
- Dùng Server Components khi phù hợp; Client Components cho tương tác cần thiết. Đối chiếu tài liệu Next.js cục bộ theo `AGENTS.md` trước khi viết mã.

Kênh tư vấn, backend biểu mẫu, lưu dữ liệu, chống spam, analytics, hosting và domain đều TBD. Không triển khai tích hợp hoặc cài dependency trong giai đoạn này. Xem [decisions.md](decisions.md).

## Campaign System

Homepage dùng một hero cấu hình chung, không nhân bản trang hoặc dữ liệu sản phẩm. `content/campaigns.ts` định nghĩa các ID ổn định `basic`, `new-semester`, `chuseok`, `christmas` và khóa lưu lựa chọn. Copy khách hàng nằm trong mục `campaign` của bảy file `messages/*.json`; xử lý tương tác nằm riêng tại `components/campaign-hero.tsx`; treatment hình ảnh nhẹ nằm trong `app/globals.css`.

Bộ chọn preview đổi chiến dịch ngay trên client và lưu ID trong `localStorage`. Đây là công cụ demo độc lập với dữ liệu chiến dịch nên có thể ẩn/xóa mà không ảnh hưởng cấu trúc hero. Để thêm chiến dịch, bổ sung ID/type, copy đồng cấu trúc cho bảy locale và CSS có scope theo `.campaign-{id}`. Một CMS tương lai có thể thay nguồn cấu hình/copy này; CMS, lịch tự động và quản trị vẫn ngoài phạm vi hiện tại.

## Smartphone catalog

Research provenance and per-model official sources are maintained in [phone-catalog-sources.md](phone-catalog-sources.md).

Smartphone dùng một hợp đồng `Phone` trong `content/products/phones.ts`: ID/slug ổn định, brand/model, media, storage variant với giá KRW nullable, color có ID/tên/swatch/media và availability, specifications, provenance và commercial verification status. `lib/products/phone-repository.ts` là biên dữ liệu nhỏ mà UI sử dụng; khi chuyển sang Payload CMS chỉ cần thay implementation repository và ánh xạ record CMS về cùng hợp đồng, không thay `PhoneCard`/`PhoneProduct`.

Dữ liệu hiện tại chứa manufacturer facts đã kiểm tra từ trang Apple Korea/Samsung Korea. Mọi giá SAmobile vẫn `null` và `price-unverified`; không phải báo giá, tồn kho hay ưu đãi. Màu độc quyền của Samsung.com/Samsung Gangnam được lưu để audit nhưng không selectable. Media dùng placeholder trung tính vì chưa xác lập quyền tái sử dụng ảnh hãng.

`phoneFinancing` giữ cấu hình tập trung theo basis points (`600` = 6%) và `[6, 12]`. `calculateFinancing` dùng lãi đơn/phẳng trên giá gốc: `interest = principal × annualRate × months / 12`; interest làm tròn half-up tới won gần nhất, total = principal + interest đã làm tròn, monthly = total / months và làm tròn half-up tới won gần nhất. Utility thuần được kiểm thử độc lập.

CTA detail luôn mã hóa phone/model, storage, color và commercial status vào query parameters rồi dẫn về consultation hiện có. Term, selected price và monthly estimate chỉ xuất hiện khi giá được xác minh. Đây chỉ là selection payload ở frontend; không tạo order, không gửi form và không khẳng định điều kiện tài chính. Backend tương lai phải xác thực lại toàn bộ ID, giá và phép tính phía server.

Route dùng chung cho mọi locale: `/{locale}/phones` và `/{locale}/phones/{slug}`. Homepage chỉ là entry point; cấu hình chi tiết nằm ở product detail. Campaign chỉ thay presentation hero hiện hữu, không tác động dữ liệu hoặc phép tính smartphone.

Payload mapping đề xuất về sau: `phones` (identity/status/translated model copy), embedded hoặc related `storageVariants`, `colors`, quan hệ `media`, và singleton `financingConfiguration`. Promotions/SEO/translations có thể là field/collection riêng; chưa triển khai schema, database, CMS hay API trong giai đoạn này.

Ngoài phạm vi có chủ ý: cart, checkout, payment, inventory, order, account, authentication, CMS/database/backend và giá/khuyến mại thật.

## Lucky wheel demo

Route `/{locale}/lucky-wheel` là bản trình diễn frontend được dẫn từ homepage. Mười segment có kích thước bằng nhau: ba segment phần thưởng mẫu và bảy segment không trúng. Trình duyệt chỉ chọn một segment để minh họa chuyển động; kết quả không có giá trị nhận thưởng và người dùng có thể quay lại không giới hạn trong demo.

Trước khi phát hành thật, việc chọn kết quả phải chuyển sang backend. Backend tương lai cần quản lý campaign, xác suất, điều kiện tham gia, giới hạn lượt, xác minh người dùng, tồn kho/mã quà, lịch sử, chống gian lận và quy trình phát thưởng. Frontend không được xem là nguồn quyết định kết quả.
