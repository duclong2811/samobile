# Đặc tả SAmobile

## Mục tiêu và đối tượng

SAmobile là đại lý bán dịch vụ di động và Internet gia đình KT tại Hàn Quốc. Website do SAmobile vận hành, không phải KT Corporation.

Mục tiêu chính: tạo yêu cầu tư vấn có chất lượng và giúp khách hàng quốc tế hiểu sản phẩm KT. Khách hàng gồm cư dân nước ngoài, người lao động, sinh viên và các khách hàng quốc tế khác đang sống tại Hàn Quốc, có thể khó hiểu gói cước, điều kiện đăng ký hoặc thủ tục lắp đặt bằng tiếng Hàn.

## Phạm vi dịch vụ hiện tại

Theo cập nhật của chủ dự án: chỉ có hai nhóm dịch vụ thương mại chính — gói cước di động và lắp đặt Internet gia đình. SIM/eSIM chỉ là thông tin phụ thuộc nhóm di động. Phạm vi này thay thế danh mục mở rộng trong các ghi chép lịch sử.

| Khu vực | Vai trò |
| --- | --- |
| Home | Giới thiệu đại lý, định hướng dịch vụ và tư vấn |
| Mobile | Gói di động, SIM/eSIM; cách chia trang chi tiết TBD |
| Internet | Internet gia đình và hướng dẫn lắp đặt đã xác minh |
| Promotions | Ưu đãi đã xác minh nguồn, điều kiện và thời hạn |
| Support | Giải thích dịch vụ và hỗ trợ của SAmobile |
| Contact / Consultation | Tiếp nhận nhu cầu qua kênh được xác nhận |

Luồng dự kiến: chọn ngôn ngữ → tìm hiểu dịch vụ → so sánh → gửi yêu cầu tư vấn → nhận phản hồi từ SAmobile. Kênh liên hệ, trường biểu mẫu, thời gian phản hồi và quy trình xử lý: TBD.

Chưa có dữ liệu gói cước thực tế được xác minh. Giá, ưu đãi, thời hạn hợp đồng, giấy tờ và eligibility đều **placeholder/TBD**; không phải báo giá hay cam kết.

## Ngôn ngữ

- Đã triển khai nội dung: Korean (`ko`), English (`en`), Vietnamese (`vi`), Simplified Chinese (`zh`), Thai (`th`), Nepali (`ne`), Uzbek (`uz`).
- Tiền tố URL: `/ko`, `/en`, `/vi`, `/zh`, `/th`, `/ne`, `/uz`.
- Slug sản phẩm dùng chung dưới locale: `/en/mobile`, `/en/internet`, `/vi/mobile`, `/vi/internet`.
- Thêm locale qua cấu hình và nội dung, không thiết kế lại ứng dụng. Tên KT và SAmobile giữ nguyên ở mọi ngôn ngữ.
- `/` chuyển tới `/en`; trình duyệt tôn trọng lựa chọn đã lưu. Lần đầu người dùng tự chọn một trong bảy ngôn ngữ. Locale không hợp lệ trả 404.

## Giai đoạn hiện tại và tiêu chí sau này

Homepage, routing và bảy ngôn ngữ đã triển khai. Phạm vi hiện tại là tinh chỉnh nhận diện và responsive trên thiết kế đã duyệt. Biểu mẫu/backend tư vấn, trang bổ sung và triển khai công khai chưa được thực hiện.

Triển khai sau này phải làm rõ vai trò đại lý, giúp so sánh sản phẩm trên điện thoại, hỗ trợ tương tác accessible và tách dữ liệu/bản dịch khỏi component. Nội dung thương mại cần được xác minh trước xuất bản. KPI và định nghĩa inquiry có chất lượng: TBD.

Xem [thiết kế](DESIGN_SYSTEM.md), [nội dung](CONTENT_GUIDE.md), [kiến trúc](architecture.md) và [quyết định](decisions.md).
