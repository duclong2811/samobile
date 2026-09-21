# Hệ thống thiết kế SAmobile

## Trạng thái

Thiết kế homepage viễn thông hiện tại đã được duyệt làm nền tảng; giữ phong cách, màu nhấn và cấu trúc khi tinh chỉnh. Logo KT được chủ dự án cung cấp tại `public/brands/kt-logo.png`; xem `brand-assets.md` cho quy tắc sử dụng và bố trí footer. Không suy diễn quyền sử dụng cho tài sản khác.

## Hướng thị giác

Phong cách viễn thông Hàn Quốc chuyên nghiệp: typography mạnh, phân cấp có chủ đích, khoảng trắng thoáng, sản phẩm dễ so sánh, giá dễ đọc và tín hiệu tin cậy có căn cứ. Có thể học cách tổ chức thông tin của các hãng lớn nhưng không sao chép website KT hoặc làm người dùng hiểu SAmobile là KT Corporation.

## Phân cấp và composition

- Mỗi trang có mục tiêu và CTA chính rõ; CTA phụ hỗ trợ tìm hiểu hoặc so sánh.
- Dùng tiêu đề, đường phân cách, hàng thông tin và bảng theo ý nghĩa. Chỉ dùng card cho đơn vị nội dung độc lập.
- Giữ nhãn thuộc tính nhất quán để so sánh. Trên mobile vẫn giữ ngữ cảnh khi chuyển bố cục.
- Giá đi cùng tiền tệ, chu kỳ và điều kiện đã xác minh. Phân biệt phí một lần, thuê thiết bị, thuế, giảm giá, thời hạn khi có dữ liệu; không mặc định đã bao gồm.

## Typography, spacing và màu

- Có vai trò chữ rõ cho tiêu đề trang, tiêu đề phần, tên sản phẩm, giá, nội dung và chú thích.
- Font cần hỗ trợ ko/en/vi và mở rộng zh/th/ne/uz; kiểm tra dấu tiếng Việt, chữ Hàn, Thái và Devanagari. Không làm nhỏ chữ để ép bản dịch vừa bố cục.
- Dùng thang khoảng cách nhất quán; khoảng trong nhóm nhỏ hơn khoảng giữa nhóm. Token, line-height, độ rộng nội dung và breakpoint cụ thể: TBD qua thiết kế.
- Màu tiết chế, nền trung tính, màu nhấn phục vụ thương hiệu và hành động. Không dùng màu làm tín hiệu duy nhất.
- Không lấy logo hoặc nhận diện KT làm nhận diện SAmobile. Tài sản KT chỉ được dùng khi quyền sử dụng được xác nhận.
- Ảnh chuyên nghiệp cần giúp hiểu dịch vụ hoặc bối cảnh khách hàng; nguồn và giấy phép phải rõ.

## Responsive và tương tác

- Mobile-first, mở rộng theo nội dung; kiểm tra điện thoại, tablet và desktop.
- Navigation, bộ chọn ngôn ngữ, so sánh và CTA phải dùng được trên màn hình hẹp và bằng bàn phím.
- Xác định default, hover, focus-visible, active, disabled; thêm loading, empty, error, success khi phù hợp.
- Dùng HTML semantic, heading hợp lý, label và lỗi rõ; không thay label bằng placeholder input.
- Mục tiêu kỹ thuật là WCAG 2.2 AA, không phải tuyên bố đã được chứng nhận. Kiểm tra tương phản, focus, zoom, thứ tự đọc và reduced motion khi triển khai.
- Chuyển động chỉ phục vụ phản hồi hoặc định hướng.

## Tránh giao diện AI chung chung

Tránh bo góc quá mức, gradient tràn lan, glassmorphism, phong cách SaaS tím/xanh chung chung, card grid lặp lại, phần tử nổi không cần thiết, pill/badge quá nhiều, animation trang trí và đặt mọi section trong card.

Visual QA cần kiểm tra phân cấp, CTA, ngữ cảnh giá, nhận diện đại lý, nội dung dài và ko/en/vi ở kích thước đại diện. Xem quy trình [frontend-design](../.agents/skills/frontend-design/SKILL.md); ghi rõ phần chưa kiểm tra thực tế.
