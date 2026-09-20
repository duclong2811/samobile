# Quy trình phát triển

## Giai đoạn hiện tại

Chỉ chỉnh tài liệu và hướng dẫn AI. Không sửa UI, routing, cấu hình ứng dụng hoặc cài package. Hoàn tất tài liệu rồi chờ chủ dự án duyệt bước tiếp theo; cập nhật giới hạn này khi phạm vi mới được cho phép.

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
| UI/bản dịch | Responsive, ko/en/vi, nội dung dài, keyboard/focus, trạng thái và visual QA |
| Logic rủi ro | Test hành vi có ý nghĩa khi có bộ kiểm thử phù hợp |

Lệnh hiện có: `npm run dev`, `npm run lint`, `npm run build`, `npm run start`. Chưa có script `test` hoặc `typecheck`. Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd`.

Không chạy dev/build hoặc thêm framework test cho thay đổi chỉ có tài liệu. Khi hoàn tất, báo cáo thay đổi, kiểm tra đã chạy và giới hạn; không tuyên bố đã test hoặc visual QA nếu chưa thực hiện. Duyệt tài liệu không đồng nghĩa cho phép triển khai/xuất bản.
