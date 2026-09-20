# Cloudflare Workers

Thiết lập theo [hướng dẫn Next.js của Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) bằng vinext (hiện là beta). Phạm vi được duyệt: chuẩn bị cấu hình và kiểm tra cục bộ; chưa đăng nhập hoặc triển khai. Các ghi chú “documentation only” trong tài liệu ban đầu là lịch sử, không áp dụng cho phạm vi này.

## Cài đặt và phát triển

Chạy từ thư mục chứa `package.json` và `wrangler.jsonc` (gốc repository `samobile`). Dùng Node.js >=22.12; đã kiểm tra với Node.js 24.18.0. Cài dependency, bao gồm devDependencies, bằng `npm ci`.

- `npm run dev`: Next.js development, giữ nguyên.
- `npm run build` và `npm run start`: Next.js production, giữ nguyên.
- `npm run dev:vinext`: môi trường phát triển Workers qua vinext, cổng 3001.
- `npm run build:vinext`: tạo Worker trong `dist/server` và assets trong `dist/client`.
- `npm run start:vinext -- --local`: preview bundle đã build bằng Wrangler/workerd trên máy, không cần đăng nhập.

`react-server-dom-webpack` được khóa ở 19.2.8 để khớp React/React DOM hiện tại. Không dùng `--force` hoặc `--legacy-peer-deps`; không nâng phiên bản các dependency có sẵn.

## Cloudflare Workers Builds

Thiết lập root directory là thư mục chứa `package.json`: `/` nếu kết nối repository Git hiện tại; chỉ dùng `samobile` nếu repository trên remote có thư mục cha đó.

| Trường | Giá trị |
| --- | --- |
| Worker name | `samobile` |
| Build command | `npm run build:vinext` |
| Deploy command | `npm run deploy:vinext -- --skip-build` |

Deploy command dùng output của build trước đó. Khi chạy độc lập, `npm run deploy:vinext` tự build rồi deploy. **Các lệnh deploy thật chưa được chạy.** Việc kết nối tài khoản/repository Cloudflare thuộc bước triển khai sau này; không lưu token hoặc account ID giả vào repository.

## Cấu hình

- `vite.config.ts`: vinext và Cloudflare Vite plugin, RSC environment với SSR child environment.
- `wrangler.jsonc`: entry `vinext/server/fetch-handler`, `nodejs_compat`, binding `ASSETS` cho tài nguyên tĩnh. Không thêm KV, R2, database, secret, custom domain hoặc cache service.
- Không cần environment variable hoặc secret của ứng dụng hiện tại.
- `dist/`, `.vinext/`, `.wrangler/`, `.dev.vars*` và `.env*` không được commit. Commit cấu hình nguồn và `package-lock.json`; build sinh `dist/server/wrangler.json`.
- Source UI, routes, bản dịch và dữ liệu sản phẩm không thay đổi. Next.js vẫn tối ưu ảnh theo cấu hình cũ. Với Workers, vinext phục vụ ảnh gốc khi chưa cấu hình Cloudflare Images; không thay đổi ảnh nguồn hay component. Tối ưu ảnh trên edge chưa bật vì cần cấu hình dịch vụ riêng.

## Kết quả kiểm tra

- `npm run lint`: đạt.
- `npm run build`: đạt, giữ `/en`, `/ko`, `/vi`.
- `npm run build:vinext`: đạt.
- `npx vinext check`: 100% các mục được scanner kiểm tra; không thay thế kiểm thử runtime.
- `npm run deploy:vinext -- --dry-run`: xác thực setup đạt, không build/deploy/đăng nhập.
- `npx wrangler deploy --config dist/server/wrangler.json --dry-run`: đóng gói Worker và assets đạt, không upload/deploy.
- `npm run dev -- --port 3120`: khởi động Next.js thành công.
- Kiểm tra HTTP trên Next.js dev: `/` chuyển 307 tới `/en`; `/vi`, `/en`, `/ko` trả 200; `/zh` trả 404.
- Preview Workers đã thử với `--local`: workerd trên Windows dừng với native access violation `0xc0000005`. Wrangler gợi ý kiểm tra Microsoft Visual C++ Redistributable; chưa xác nhận nguyên nhân. Cần kiểm tra lại preview trên môi trường workerd hoạt động (ví dụ Linux) trước khi coi runtime Workers đã được xác minh. Không tự sửa dependency hệ thống hoặc dùng remote preview.
