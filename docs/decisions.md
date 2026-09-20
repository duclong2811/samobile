# Nhật ký quyết định

## Đã xác nhận — 2026-09-20

- Tên SAmobile; đại lý cung cấp dịch vụ KT, không phải KT Corporation.
- Phục vụ khách hàng quốc tế tại Hàn Quốc; mục tiêu chính là yêu cầu tư vấn có chất lượng.
- Danh mục Mobile, SIM/eSIM, Internet, Internet + TV, Promotions và Support/Consultation.
- Ưu tiên ko/en/vi, dự kiến zh/th/ne/uz; URL theo locale và cho phép thêm ngôn ngữ.
- Nhận diện riêng, phong cách viễn thông chuyên nghiệp; tránh sao chép KT và UI SaaS chung chung.
- Tách dữ liệu sản phẩm, bản dịch và component; mọi dữ kiện chưa xác minh là placeholder/TBD.
- Giữ khối Next.js trong AGENTS.md; CLAUDE.md tiếp tục tham chiếu AGENTS.md.
- Hiện chỉ tạo tài liệu và skill, chưa cài package hoặc triển khai UI.

## Đề xuất kỹ thuật

Một cây `app/[locale]`, cấu hình locale trung tâm và dữ liệu trong repository trước khi cần CMS. Đây là định hướng chưa triển khai; xem [architecture.md](architecture.md).

## Còn mở

| Chủ đề | Cần xác nhận |
| --- | --- |
| Nhận diện | Logo, màu, font, ảnh và quyền sử dụng |
| Dữ liệu sản phẩm | Gói, giá, phí, hợp đồng, ưu đãi, giấy tờ, eligibility và nguồn xác minh |
| Quản trị nội dung | Người duyệt, nguồn chấp nhận, lịch rà soát, xử lý hết hạn |
| Tư vấn | Kênh, địa chỉ/liên hệ, giờ phục vụ, trường biểu mẫu, quy trình phản hồi |
| Ngôn ngữ | Locale mặc định, `/`, fallback, ngôn ngữ nguồn, người rà soát, biến thể zh và chữ viết uz |
| Cấu trúc trang | SIM/eSIM có trang riêng, slug còn lại, phạm vi phát hành đầu tiên |
| Đo lường | Định nghĩa inquiry chất lượng, KPI, analytics và đồng ý nếu cần |
| Pháp lý/dữ liệu | Thông tin pháp nhân, quyền riêng tư, đồng ý, nơi lưu và thời hạn lưu dữ liệu |
| Hạ tầng | Domain, hosting, backend/CMS nếu cần, thư viện i18n |
| Thiết kế chi tiết | Token, bố cục, so sánh sản phẩm và CTA |

Chỉ chuyển sang đã xác nhận khi có quyết định của chủ dự án hoặc bằng chứng phù hợp. Ghi ngày và lý do; không coi đề xuất AI là yêu cầu đã duyệt.
