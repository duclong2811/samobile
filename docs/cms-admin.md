# Hệ quản trị nội dung và tin tức

Trạng thái: giai đoạn 1 đã triển khai (trang quản trị + tin tức công khai). Quét tin và dịch tự động là giai đoạn 2, chưa làm.

## Phạm vi

- `/admin`: trang quản trị tự viết, giao diện tiếng Việt. Tổng quan, danh sách bài (lọc theo trạng thái, tìm kiếm), trình soạn thảo có tab 7 ngôn ngữ, nhật ký thao tác.
- `/{locale}/news` và `/{locale}/news/{slug}`: danh sách và chi tiết bài đã xuất bản. Một bài chỉ hiện ở ngôn ngữ có bản dịch.
- Chưa có liên kết tới `/news` trên header/footer; cần chủ dự án duyệt vị trí (xem *Việc còn mở*).

## Kiến trúc

| Thành phần | Chi tiết |
| --- | --- |
| Dữ liệu | Cloudflare D1, binding `DB`, `migrations/0001_init.sql`: `articles`, `article_translations`, `audit_log` |
| Truy cập D1 | `lib/db/client.ts` nạp `cloudflare:workers` lúc request (lazy) để `next build` thường vẫn chạy |
| Bài viết | `lib/news/repository.ts` (đọc công khai + ghi quản trị); `lib/admin/validation.ts` kiểm tra đầu vào |
| Đăng nhập | Cloudflare Access; ứng dụng tự xác minh JWT (`lib/admin/access-jwt.ts`, `lib/admin/auth.ts`) |
| Giao diện | `app/admin/*`, `components/admin/*`, chữ giao diện ở `lib/admin/labels.ts` |
| Hiển thị nội dung | `components/rich-text.tsx` chỉ dựng đoạn văn, `##` tiêu đề, `-` danh sách; không dùng HTML thô |

Trạng thái bài: `draft` (nháp), `published` (xuất bản), `hidden` (ẩn). `published_at` đóng dấu lần đầu xuất bản và giữ nguyên. Chuyên mục nhạy cảm (`visa`, `labor`, `tax`, `health`) hiện thêm dòng miễn trừ ở trang công khai; bản dịch đánh dấu tự động hiện cảnh báo.

## Bảo mật

- Fail closed: chưa cấu hình Access thì không ai vào được `/admin` (trừ localhost có `ADMIN_DEV_EMAIL` trong `.dev.vars`, bị vô hiệu ngay khi `CF_ACCESS_TEAM_DOMAIN` và `CF_ACCESS_AUD` được đặt).
- Mọi trang và mọi Server Action tự gọi `requireAdmin()`; Server Action còn kiểm tra Origin (chống CSRF). Không dựa vào việc ẩn nút trên giao diện.
- JWT: RS256, kiểm tra chữ ký, `aud`, `iss`, `exp`, `nbf`; từ chối `alg=none`/HS256; tên miền team phải khớp `*.cloudflareaccess.com`. Có `ADMIN_EMAILS` (tùy chọn) làm danh sách cho phép bổ sung.
- Truy vấn dùng tham số ràng buộc; ký tự `%` `_` `\` trong ô tìm kiếm được escape. Link nguồn chỉ nhận `http(s)`; link ngoài hiển thị với `rel="noopener noreferrer nofollow"`.
- `/admin` trả `Cache-Control: no-store`, `X-Frame-Options: DENY`, `noindex`. Mọi thay đổi ghi vào `audit_log` (ai, làm gì, khi nào).
- Kiểm thử: `npm run test:admin-access` (15 ca tấn công JWT). Đã kiểm tra tay trên bản chạy: không đăng nhập hoặc Origin giả đều không ghi được dữ liệu.

## Thiết lập để chạy thật (làm một lần)

Chưa làm các bước này thì deploy sẽ lỗi vì `wrangler.jsonc` đang giữ `database_id` giữ chỗ.

1. Tạo D1: `npx wrangler d1 create samobile`, dán `database_id` trả về vào `wrangler.jsonc`.
2. Áp dụng migration lên bản live: `npm run db:migrate:remote`.
3. Cloudflare Zero Trust > Access > Applications > Add > Self-hosted. Gắn domain của Worker, path `admin*`. Policy: cho phép đúng email của bạn.
4. Chép **Team domain** (`xxx.cloudflareaccess.com`) và **Application Audience (AUD) tag** vào `vars` trong `wrangler.jsonc` (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`); đặt `ADMIN_EMAILS` nếu muốn khóa thêm. Đây không phải bí mật.
5. Deploy như cũ: `npm run build:vinext` rồi `npm run deploy:vinext -- --skip-build`.

Lưu ý: Access trên `*.workers.dev` áp dụng cho cả Worker (khóa luôn website công khai). Muốn chỉ khóa `/admin` thì cần custom domain; đây là lý do nên chốt domain sớm.

Phát triển cục bộ: `cp .dev.vars.example .dev.vars`, `npm run db:migrate:local`, `npm run dev:vinext`, mở `http://localhost:3001/admin`. `npm run dev` (Next thường) vẫn chạy trang cũ nhưng không có D1, nên `/admin` và `/news` cần `dev:vinext`.

## Giai đoạn 2 (chưa làm, đã chốt hướng)

Cron Trigger (Workers) lấy tin từ báo/cổng chính phủ qua RSS → loại bài trùng → AI lọc bài liên quan người nước ngoài → tóm tắt + dịch Việt, Nepal, Thái, Uzbekistan → ghi vào D1 với `origin='auto'`, `machine_translated=1` → tự xuất bản, kèm công tắc tắt khẩn cấp và nút gỡ bài. Cần Queues để chia nhỏ việc; khóa API lưu bằng `wrangler secret`. Chuyên mục nhạy cảm đề xuất giữ ở `draft` chờ duyệt; xem `decisions.md`.

## Việc còn mở

- Vị trí liên kết Tin tức trên header/footer và thiết kế trang danh sách (đang dùng khung trang Điện thoại).
- Danh sách nguồn tin cụ thể, điều khoản sử dụng từng nguồn (bản quyền), và nguồn mạng xã hội hợp lệ.
- Người bản ngữ rà soát chuỗi giao diện `news` ở ne/uz/th (do AI soạn, chưa có người duyệt).
- Quản lý sản phẩm, ưu đãi, vé máy bay trong trang quản trị: chưa làm.
