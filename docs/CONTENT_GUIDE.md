# Hướng dẫn nội dung

## Danh tính và giọng điệu

SAmobile vận hành website và cung cấp/bán dịch vụ KT với vai trò đại lý. Không giới thiệu SAmobile là KT Corporation hoặc website do KT Corporation vận hành. Nêu rõ vai trò đại lý tại vị trí phù hợp như giới thiệu, footer và tư vấn.

Câu mô tả nền tảng: “SAmobile là đại lý cung cấp dịch vụ di động và Internet gia đình KT tại Hàn Quốc.” Bản dịch cuối cùng cần rà soát trước xuất bản.

Viết dễ hiểu, trực tiếp, tôn trọng khách hàng quốc tế; giải thích thuật ngữ viễn thông. Không mặc định khách hàng hiểu tiếng Hàn hoặc thủ tục. Không tạo sự khan hiếm, đếm ngược hoặc áp lực mua hàng thiếu căn cứ.

## Xác minh và placeholder

Không bịa giá, ưu đãi, điều kiện đăng ký, giấy tờ, hợp đồng, phạt chấm dứt, lịch lắp đặt hoặc tuyên bố pháp lý. Không dùng “official KT website”, “best price”, “cheapest”, “guaranteed approval”, “official KT support” hay tuyên bố tương đương nếu chưa được xác minh rõ. Mọi nội dung vẫn phải đúng danh tính đơn vị vận hành.

- Thông tin chưa xác minh ghi trực tiếp **placeholder/TBD**, ví dụ `Giá: TBD — chưa xác minh`; không dùng số tiền giả giống báo giá thật.
- Không đổi dữ liệu thiếu thành 0, “miễn phí” hoặc điều kiện suy đoán.
- Repository chưa có dữ liệu gói cước thực tế đã xác minh.
- Placeholder dành cho soạn thảo/review; trước xuất bản phải xác minh hoặc loại khỏi phần trình bày như đề nghị bán hàng thật.

## Dữ liệu sản phẩm

Lưu ngoài component: ID ổn định, loại dịch vụ, thuộc tính so sánh, trạng thái xác minh, nguồn, ngày kiểm tra và người rà soát. Giá có giá trị, tiền tệ, chu kỳ; dữ liệu chưa biết để null/trống và trạng thái TBD.

Ưu đãi cần thời hạn và điều kiện đã xác minh. Kiểm tra riêng thuế, phí thiết bị, lắp đặt và hợp đồng; không giả định nguồn đã bao gồm tất cả. Dữ liệu hết hạn hoặc mâu thuẫn cần kiểm tra lại.

Quy trình đề xuất: thu thập nguồn → rà soát dữ kiện/thời hạn → cập nhật dữ liệu → dịch → rà soát bản dịch → duyệt xuất bản. Nguồn được chấp nhận và người duyệt: TBD.

## Dịch thuật

- Quy tắc bắt buộc cho cả ko/en/vi/zh/th/ne/uz: tên riêng luôn là **KT** và **SAmobile**, đúng chữ hoa/chữ thường. Không dịch, phiên âm, tách tên, viết tắt hoặc dùng CSS đổi kiểu chữ của tên thương hiệu; chỉ dịch mô tả xung quanh.

- Tách thông điệp và nội dung dịch khỏi JSX; dùng khóa và ID ổn định.
- Dùng chung nguồn dữ kiện thương mại giữa locale; không chép giá độc lập vào từng bản dịch.
- Cả ko/en/vi/zh/th/ne/uz có nội dung đầy đủ trong `messages/`; mọi locale dùng cùng dữ liệu sản phẩm. `zh` dùng tiếng Trung giản thể.
- Dịch cả CTA, điều kiện, label, lỗi, metadata và nội dung accessibility; thống nhất thuật ngữ SIM/eSIM và thương hiệu.
- Định dạng số/tiền/ngày theo locale khi triển khai; không ngầm đổi tiền theo ngôn ngữ.
- Không âm thầm hiển thị điều kiện quan trọng bằng ngôn ngữ khác. Fallback, ngôn ngữ nguồn và người rà soát: TBD.

## Tư vấn và pháp lý

Số điện thoại, địa chỉ, giờ làm việc, thời gian phản hồi, thông tin đăng ký kinh doanh, chính sách quyền riêng tư và nội dung đồng ý thu thập dữ liệu: TBD. Không tạo thông tin giả hoặc điều khoản như đã được duyệt. Biểu mẫu tương lai chỉ thu thập dữ liệu cần thiết theo phạm vi đã xác nhận.
