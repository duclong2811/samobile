---
name: frontend-design
description: Thiết lập hướng thị giác, thiết kế hoặc đánh giá UI SAmobile với responsive và accessibility. Dùng cho frontend có yếu tố thiết kế, không dùng cho backend hoặc tài liệu không liên quan thiết kế.
---

# Frontend design cho SAmobile

## Phạm vi

Hỗ trợ đúng nhiệm vụ được giao; skill không tự cho phép triển khai UI, cài package hoặc xuất bản. Nếu yêu cầu chỉ là thiết kế/review, dừng ở kết quả tương ứng. Áp dụng quy trình theo quy mô thay đổi, không tự thiết kế lại toàn site.

Đọc [AGENTS.md](../../../AGENTS.md), [đặc tả](../../../docs/PROJECT_SPEC.md), [design system](../../../docs/DESIGN_SYSTEM.md) và [content guide](../../../docs/CONTENT_GUIDE.md). Đọc [architecture](../../../docs/architecture.md) khi liên quan component, dữ liệu hoặc i18n.

SAmobile là đại lý dịch vụ KT, không phải KT Corporation. Giữ nhận diện riêng, không bịa thông tin thương mại để lấp bố cục; dữ kiện chưa xác minh phải là placeholder/TBD.

## Quy trình

1. **Kiểm tra hệ thống hiện có:** đọc CSS, token, font, component và trang liên quan. Phân biệt thiết kế đã duyệt với mẫu Next.js; tái sử dụng chuẩn hiện có khi phù hợp.
2. **Xác lập hướng thị giác trước triển khai:** nêu mục tiêu trang, người dùng, nội dung chính, CTA và cách thể hiện phong cách viễn thông. Chuẩn bị brief/phác thảo tương xứng trước viết UI; không tự gán màu/font thành chuẩn thương hiệu. Hỏi duyệt chỉ khi phạm vi hoặc quyết định quan trọng đòi hỏi.
3. **Hierarchy:** xác định thứ tự đọc và CTA chính; đặt thông tin so sánh, giá và điều kiện gần hành động liên quan.
4. **Typography:** phân vai chữ rõ, bảo đảm khả năng đọc; kiểm tra glyph/ngắt dòng ko/en/vi và dự liệu zh/th/ne/uz. Không thu nhỏ chữ để ép bản dịch vừa layout.
5. **Spacing:** dùng thang khoảng cách nhất quán, nhóm nội dung theo ý nghĩa; kiểm tra alignment tiêu đề, giá, hàng so sánh và CTA.
6. **Color:** dùng màu nhấn có mục đích và nền tiết chế; kiểm tra tương phản và tín hiệu ngoài màu. Không lấy nhận diện KT làm nhận diện SAmobile.
7. **Composition:** chọn bảng, hàng, ảnh hoặc card theo nội dung; tránh lặp card grid cho mọi section. Ảnh cần mục đích và nguồn sử dụng phù hợp.
8. **Responsive:** bắt đầu từ màn hình hẹp rồi mở rộng; kiểm tra navigation, locale switcher, giá, so sánh, nội dung dài và zoom. Giữ nhãn thuộc tính khi đổi bố cục.
9. **Interaction states:** bao phủ hover, focus-visible, active, disabled; loading/error/empty/success khi liên quan. Không tạo CTA có vẻ hoạt động khi chưa xác định hành vi; nêu TBD trong review.
10. **Accessibility:** kiểm tra semantic HTML, heading, keyboard, focus, label, lỗi, alt text, tương phản và reduced motion. Hướng đến WCAG 2.2 AA; không nhầm mục tiêu với kết quả kiểm tra.
11. **Visual QA:** khi được phép triển khai, xem render ở mobile/tablet/desktop đại diện, ko/en/vi và trạng thái liên quan. Dùng browser/screenshot nếu có; sửa lỗi thấy được, báo giới hạn nếu chưa kiểm tra trực quan.
12. **Kiểm tra UI giống mẫu AI:** rà bo góc quá nhiều, gradient, glassmorphism, màu SaaS tím/xanh thiếu cơ sở, card lặp, phần tử nổi, pill/badge và animation trang trí. Loại phần không giúp hiểu dịch vụ hoặc thao tác; xác nhận nhận diện SAmobile và khả năng so sánh rõ.

## Báo cáo hoàn tất

Tóm tắt hướng thị giác, quyết định, phạm vi thay đổi, viewport/ngôn ngữ/trạng thái đã kiểm tra và TBD. Giữ dữ liệu và bản dịch ngoài component. Không tuyên bố visual QA đã đạt khi chỉ đọc mã; không chuyển từ tài liệu/review sang triển khai nếu chưa được giao.
