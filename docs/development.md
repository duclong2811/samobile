# Quy trình phát triển

## Giai đoạn hiện tại

Chủ dự án đã duyệt chỉnh homepage hiện tại, thương hiệu, bảy locale và responsive. Giữ nguyên dữ liệu thương mại và cấu hình Cloudflare/vinext; không thêm trang, tích hợp, đăng nhập hoặc deploy trong phạm vi này. Các ghi chép chỉ-làm-tài-liệu trước đó là lịch sử.

## Quy trình

1. Đọc `AGENTS.md`, kiểm tra Git và tệp liên quan; bảo toàn thay đổi ngoài nhiệm vụ.
2. Đọc đặc tả/kiến trúc và tài liệu phù hợp; dùng skill `frontend-design` khi thiết kế hoặc đánh giá UI.
3. Trước khi viết mã Next.js, đọc phần liên quan trong `node_modules/next/dist/docs/` theo hướng dẫn Next.js-managed.
4. Phân biệt yêu cầu đã chốt, đề xuất và TBD. Không tự tạo dữ kiện kinh doanh; hỏi khi thiếu thông tin ảnh hưởng thực sự đến nhiệm vụ.
5. Khi được phép triển khai, giữ cấu trúc đơn giản, TypeScript strict, tên rõ trách nhiệm; tách dữ liệu và bản dịch khỏi component.
6. Thêm dependency chỉ trong phạm vi được duyệt và có lý do. Không commit secrets/dữ liệu khách hàng hoặc tự triển khai dịch vụ ngoài.
7. Trao đổi bằng tiếng Việt; UI theo locale. Cập nhật quyết định đã xác nhận trong `decisions.md`, không biến đề xuất thành quyết định của chủ dự án.

## Kiểm tra

| Loại thay đổi | Kiểm tra phù hợp |
| --- | --- |
| Tài liệu | Diff, link nội bộ, tính nhất quán, TBD và bảo toàn khối Next.js |
| Mã ứng dụng | Lint, TypeScript/build và hành vi bị ảnh hưởng theo phạm vi |
| UI/bản dịch | Responsive, ko/en/vi/zh/th/ne/uz, nội dung dài, keyboard/focus, trạng thái và visual QA |
| Logic rủi ro | Test hành vi có ý nghĩa khi có bộ kiểm thử phù hợp |

Lệnh hiện có: `npm run dev`, `npm run lint`, `npm run build`, `npm run start`. Chưa có script `test` hoặc `typecheck`. Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd`.

Không chạy dev/build hoặc thêm framework test cho thay đổi chỉ có tài liệu. Khi hoàn tất, báo cáo thay đổi, kiểm tra đã chạy và giới hạn; không tuyên bố đã test hoặc visual QA nếu chưa thực hiện. Duyệt tài liệu không đồng nghĩa cho phép triển khai/xuất bản.

Kiểm tra homepage đa ngôn ngữ hiện tại với `tests/homepage.browser.mjs`: ko/en/vi/zh/th/ne/uz ở 1440, 1024, 768, 430, 390, 375 và 320px; menu mobile, modal, lưu ngôn ngữ, logo, thông số gói cước và tên thương hiệu. Chạy build Next.js và vinext tuần tự vì cả hai sinh route types trong `.next/`.
