---
type: Reference
title: Code Map
description: Top-level layout and entry points for content, routes, search, and static assets.
tags: [layout]
---

# Code Map

## Layout

| Path | Purpose |
| --- | --- |
| `src/routes/` | SvelteKit routes and endpoints |
| `src/content/docs/` | Documentation markdown (`NN-slug.md`) |
| `src/content/pages/` | Non-docs markdown pages |
| `src/lib/content/` | Doc discovery, types, markdown → HTML |
| `src/lib/search/` | Search index build (server) + FlexSearch UI (client) |
| `src/lib/components/` | Reusable Svelte UI (`site/`, `docs/`, home widgets) |
| `src/lib/api.ts` | GitHub contributors fetch |
| `src/config.ts` | Site SEO/nav/social config |
| `src/app.css`, `src/vars.css` | Global styles / CSS variables |
| `src/fonts/` | Self-hosted Inter / Fira Code |
| `static/` | Public static files (logos, images, robots.txt) |
| `types/flexsearch/` | Local FlexSearch module typing |
| `docs/` | **Generated** static build output (gitignored) |
| `.svelte-kit/` | SvelteKit generated (gitignored) |

## Modules
- **Content:** `docs.ts` (list/get/sidebar/routes/pages), `markdown.ts` (render), `slug.ts`, `types.ts`
- **Search server:** `content.ts` (blocks), `markdown.ts` (plaintext for index)
- **Search client:** `search.ts`, `worker.ts`, `store.ts`, `SearchBox` / `SearchModal`
- **Docs UI:** `DocsSidebar.svelte`, `OnThisPage.svelte`
- **Site shell:** `SiteShell.svelte`, `Navbar.svelte`, `SEO.svelte`

## Entry points
| Route / file | Role |
| --- | --- |
| `src/routes/+page.*` | Home; loads merged contributors |
| `src/routes/docs/+page.ts` | 307 → `/docs/get-started` |
| `src/routes/docs/[slug]/+page.server.ts` | Doc page load + `entries()` for prerender |
| `src/routes/benchmarks/+page.server.ts` | Renders `src/content/pages/benchmarks.md` |
| `src/routes/search/+page.server.ts` | Search page data |
| `src/routes/search.json/+server.ts` | Prerendered search JSON |
| `src/routes/sitemap.xml/+server.ts` | Sitemap from `getAllRoutes()` |
| `vite.config.ts` | Full reload on `src/content/**/*.md` edits |

## Generated code
- Do not hand-edit `docs/` or `.svelte-kit/`.
- Regenerate site with `npm run build` (preview with `npm run preview`).
- `svelte-kit sync` via `npm run package` for generated Kit types when needed.

## Sources
- `src/routes/`
- `src/lib/`
- `svelte.config.js`
- `.gitignore`
