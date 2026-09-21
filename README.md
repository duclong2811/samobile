# SAmobile

SAmobile là đại lý cung cấp dịch vụ di động và Internet gia đình KT tại Hàn Quốc cho khách hàng quốc tế. Website do SAmobile vận hành, không phải KT Corporation.

Mục tiêu: giúp khách hàng hiểu dịch vụ và tìm thông tin tư vấn phù hợp. Homepage hiện có hai dịch vụ: gói di động và lắp đặt Internet gia đình, với bảy ngôn ngữ và giao diện responsive. Các kênh liên hệ chưa được xác minh vẫn được đánh dấu chờ cập nhật.

## Stack hiện tại

Next.js 16.3.5 (App Router), React/React DOM 19.2.8, TypeScript ^5 strict, Tailwind CSS ^4, PostCSS, ESLint ^9 và npm. Có `package-lock.json`; mã trong `app/`, tài nguyên trong `public/`, alias `@/*` trỏ về gốc repository.

## Chạy dự án

Từ thư mục `samobile/`, khi dependencies đã có:

```sh
npm run dev
```

Mở http://localhost:3000. Lệnh khác: `npm run lint`, `npm run build`, `npm run start` (sau build). Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd`.

Kiểm tra thay đổi giao diện bằng lint, build Next.js, build vinext và kiểm tra trình duyệt. Chạy hai build tuần tự vì cùng sinh route types trong `.next/`.

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

Đã hỗ trợ ko/en/vi/zh/th/ne/uz. Tên thương hiệu luôn giữ nguyên chính xác `KT` và `SAmobile` trong mọi ngôn ngữ. Dữ liệu gói cước do chủ dự án cung cấp được giữ riêng trong `content/`; thông tin chưa xác minh vẫn là placeholder/TBD.

Cloudflare Workers deployment setup: [vinext build/deploy guide](docs/cloudflare-workers.md).
