<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SAmobile

- Communicate with the project owner in Vietnamese.
- SAmobile is a sales agency providing KT services, not KT Corporation. Preserve its own identity.
- Brand names are invariant in every locale: use exactly `KT` and `SAmobile` in text. Never translate, transliterate, respell, abbreviate, change capitalization, or apply CSS text-transform to these names. Only translate surrounding descriptions. Preserve the authorized KT image unchanged.
- Read [scope](docs/PROJECT_SPEC.md), [architecture](docs/architecture.md), and [workflow](docs/development.md) before relevant work. For UI/copy, also read [design](docs/DESIGN_SYSTEM.md) and [content](docs/CONTENT_GUIDE.md).
- For frontend design, use [.agents/skills/frontend-design/SKILL.md](.agents/skills/frontend-design/SKILL.md).
- Keep product facts and translations separate from components. Mark unverified information placeholder/TBD; never invent commercial or legal claims.
- Current authorized scope: refine the existing homepage, branding, seven locales and responsive behavior. Preserve supplied commercial data and Cloudflare/vinext configuration. Do not add pages, integrations, authenticate or deploy without a new request.
- Inspect existing changes, limit edits to the task, run appropriate checks, and report results and open decisions. Keep detailed rules in `docs/` and preserve the Next.js-managed block above.
