# Kiến trúc

## Hiện trạng

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

- Tiền tố `/ko`, `/en`, `/vi`, sau này `/zh`, `/th`, `/ne`, `/uz`.
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
