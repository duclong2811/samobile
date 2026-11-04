# Hệ quản trị nội dung và tin tức

Trạng thái: giai đoạn 1 (trang quản trị + tin tức công khai) đã triển khai. Giai đoạn 2 (quét tin và dịch bằng DeepSeek) đã viết và kiểm thử với máy chủ giả, chưa chạy với DeepSeek thật.

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

## Giai đoạn 2: quét tin và dịch tự động (đã viết, chưa chạy với DeepSeek thật)

Worker riêng `samobile-ingest` (`workers/ingest/`), chạy mỗi giờ bằng Cron Trigger. Tách khỏi website để khóa DeepSeek chỉ nằm ở worker này.

Luồng: đọc RSS của các nguồn đã bật → bỏ bài đã xem (`ingest_items`) → bài có mô tả dưới 40 ký tự thì bỏ qua, không gọi AI → một lần gọi DeepSeek cho mỗi bài (chọn lọc + chuyên mục + tóm tắt + dịch vi/ne/th/uz, trả về JSON) → kiểm tra JSON nghiêm ngặt → ghi bài (`origin='auto'`, `machine_translated=1`, kèm tên nguồn và link gốc) trong một giao dịch với sổ cái và nhật ký.

| Chi tiết | Giá trị |
| --- | --- |
| Dữ liệu lấy từ nguồn | Chỉ tiêu đề và mô tả trong RSS; không tải toàn văn bài |
| Giới hạn | `MAX_ITEMS_PER_RUN` (mặc định 6) bài mỗi lần chạy; bài lỗi thử lại tối đa 3 lần |
| Công tắc | `/admin/ingest`: bật/tắt quét (mặc định **tắt**); giữ nhóm nhạy cảm chờ duyệt (mặc định **giữ**) |
| Dừng khẩn | Sai khóa API hoặc hết tiền (HTTP 401/402/403) thì dừng cả lượt chạy ngay |
| Từ chối chạy | Thiếu `DEEPSEEK_API_KEY`, để trống `DEEPSEEK_MODEL`, hoặc URL không phải https |
| Quản lý | `/admin/ingest`: thêm/tắt/xóa nguồn RSS, xem nhật ký quét và lý do bỏ qua/lỗi |

### Thiết lập để chạy thật

1. Áp dụng migration mới lên DB live: `npm run db:migrate:remote` (có `0002_ingest.sql`).
2. Sửa `workers/ingest/wrangler.jsonc`: dán cùng `database_id` với file gốc; điền `DEEPSEEK_MODEL` đúng tên model trong tài khoản DeepSeek của bạn (để trống có chủ đích: tên model đổi theo thời gian và mình không xác minh được từ môi trường phát triển). Kiểm tra lại `DEEPSEEK_BASE_URL` theo tài liệu DeepSeek.
3. Đặt hai secret (không dán khóa vào chat hay vào file): `npx wrangler secret put DEEPSEEK_API_KEY --config workers/ingest/wrangler.jsonc` và `npx wrangler secret put INGEST_RUN_TOKEN --config workers/ingest/wrangler.jsonc` (chuỗi ngẫu nhiên từ 32 ký tự).
4. `npm run deploy:ingest`.
5. Vào `/admin/ingest`, thêm nguồn RSS, rồi bật công tắc.
6. Thử một lần: `POST https://samobile-ingest.<tài khoản>.workers.dev/run` với header `Authorization: Bearer <INGEST_RUN_TOKEN>`; xem kết quả trong nhật ký. Xong có thể đặt `"workers_dev": false` để bỏ endpoint này (cron vẫn chạy).

Chạy thử cục bộ: tạo `workers/ingest/.dev.vars` (`DEEPSEEK_API_KEY=...`, `INGEST_RUN_TOKEN=...`), `npm run db:migrate:local`, `npm run dev:ingest`. File `.dev.vars` bị git bỏ qua.

### Đã kiểm chứng và chưa kiểm chứng

- Đã kiểm chứng bằng máy chủ giả (RSS + API giống DeepSeek) chạy với worker thật trên workerd: bài liên quan, không liên quan, quá ngắn, JSON hỏng, thiếu ngôn ngữ, slug độc, bài giữ lại chờ duyệt, thử lại tối đa 3 lần, không tạo bài trùng, công tắc tắt, sai khóa thì dừng, thiếu tên model thì từ chối. `npm run test:ingest` (21 ca) chạy phần đọc RSS, kiểm tra kết quả AI và gọi API.
- **Chưa kiểm chứng**: gọi DeepSeek thật (môi trường phát triển không truy cập được tên miền DeepSeek và không có khóa); tên model và `response_format` hiện hành của DeepSeek; chất lượng bản dịch ne/th/uz; hành vi trên bản Cloudflare live (giới hạn subrequest của gói Workers đang dùng). Hãy chạy thử với 1-2 nguồn và đọc kỹ các bài đầu tiên trước khi để chạy tự động.
- Giới hạn đã biết: chất lượng tóm tắt phụ thuộc đoạn mô tả trong RSS (thường ngắn); chưa gộp bài trùng nội dung giữa các báo; AI có thể phân loại sai chuyên mục (sai sang nhóm không nhạy cảm thì bài tự đăng).

## Việc còn mở

- Vị trí liên kết Tin tức trên header/footer và thiết kế trang danh sách (đang dùng khung trang Điện thoại).
- Danh sách nguồn RSS cụ thể và điều khoản sử dụng từng nguồn (bản quyền). Mạng xã hội chưa hỗ trợ.
- Người bản ngữ rà soát chuỗi giao diện `news` ở ne/uz/th (do AI soạn, chưa có người duyệt).
- Quản lý sản phẩm, ưu đãi, vé máy bay trong trang quản trị: chưa làm.
