# SAmobile

SAmobile là đại lý cung cấp dịch vụ di động và Internet gia đình KT tại Hàn Quốc cho khách hàng quốc tế. Website do SAmobile vận hành, không phải KT Corporation.

Mục tiêu: giúp khách hàng hiểu dịch vụ và gửi yêu cầu tư vấn phù hợp. Repository hiện là mẫu Next.js cùng bộ tài liệu chuẩn bị phát triển; chưa triển khai UI sản phẩm.

## Stack hiện tại

Next.js 16.3.5 (App Router), React/React DOM 19.2.8, TypeScript ^5 strict, Tailwind CSS ^4, PostCSS, ESLint ^9 và npm. Có `package-lock.json`; mã trong `app/`, tài nguyên trong `public/`, alias `@/*` trỏ về gốc repository.

## Chạy dự án

Từ thư mục `samobile/`, khi dependencies đã có:

```sh
npm run dev
```

Mở http://localhost:3000. Lệnh khác: `npm run lint`, `npm run build`, `npm run start` (sau build). Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd`.

Giai đoạn hiện tại chỉ chuẩn bị tài liệu, không cài package hoặc thay đổi UI. Không cần chạy dev/build khi chỉ chỉnh tài liệu.

## Tài liệu

| Tệp | Nội dung |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Điểm bắt đầu cho AI, giữ hướng dẫn Next.js |
| [CLAUDE.md](CLAUDE.md) | Tham chiếu hướng dẫn chung |
| [PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Mục tiêu, đối tượng, danh mục và ngôn ngữ |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Định hướng thị giác và tiêu chí thiết kế |
| [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | Danh tính đại lý, xác minh dữ kiện và dịch thuật |
| [architecture.md](docs/architecture.md) | Kiến trúc đa ngôn ngữ và ranh giới dữ liệu |
| [development.md](docs/development.md) | Quy trình và kiểm tra theo phạm vi |
| [decisions.md](docs/decisions.md) | Quyết định đã chốt và còn mở |
| [frontend-design](.agents/skills/frontend-design/SKILL.md) | Workflow thiết kế và visual QA |

Ưu tiên ko/en/vi; dự kiến zh/th/ne/uz. Mọi thông tin sản phẩm chưa xác minh là placeholder/TBD, không phải báo giá hoặc cam kết dịch vụ.

Cloudflare Workers deployment setup: [vinext build/deploy guide](docs/cloudflare-workers.md).
