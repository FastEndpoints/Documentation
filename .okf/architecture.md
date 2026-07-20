---
type: Architecture
title: Architecture
description: Static SvelteKit docs site with filesystem markdown content and prerendered search.
tags: [architecture]
---

# Architecture

## Style
Single static SvelteKit 2 app (Svelte 5). Full prerender (`prerender = true` on layout and routes). `@sveltejs/adapter-static` writes pages and assets into `docs/`.

```text
Markdown (src/content)
  → content loaders (src/lib/content)
  → route loads (+page.server.ts)
  → renderMarkdown (marked + shiki)
  → prerendered HTML

Docs also → search server content → search.json
  → browser FlexSearch worker
```

## Components
| Area | Role |
| --- | --- |
| `src/routes` | Pages and endpoints (`/`, `/docs/[slug]`, `/benchmarks`, `/search`, `/search.json`, `/sitemap.xml`) |
| `src/content/docs` | Ordered documentation markdown |
| `src/content/pages` | Standalone pages (benchmarks) |
| `src/lib/content` | Read/parse docs, slugs, headings, sidebar |
| `src/lib/content/markdown.ts` | HTML render: fences, admonitions, heading anchors |
| `src/lib/search/server` | Build search blocks from doc bodies |
| `src/lib/search/client` | FlexSearch index, modal UI, web worker |
| `src/lib/components` | Site chrome, docs sidebar/TOC, home widgets, SEO |
| `src/config.ts` | Site URL, SEO, social links, navbar |
| `static/` | Static assets copied into build output |
| `docs/` | Generated static site (do not hand-edit) |

## Dependency rules
- Routes load content via `$lib/content/*` and `$lib/search/server/*` (server/build time filesystem access).
- Client search must not import Node `fs` content loaders; it consumes `/search.json`.
- UI components under `$lib/components`; shared config from `src/config.ts`.
- Do not import from `docs/` build output as source.

## Communication
- No backend API owned by this app after deploy.
- Build/prerender: GitHub REST for contributors (`src/lib/api.ts`).
- Browser: fetch `/search.json`; optional external links (GitHub, Discord, Open Collective, API ref).

## Persistence
None. Content is markdown on disk; output is static files.

## Invariants
- Site is fully prerenderable; missing heading ids fail build (`handleMissingId: 'fail'`).
- Doc filenames must match `NN-slug.md`; frontmatter `title` and `description` required.
- `/docs` redirects to `/docs/get-started`.
- Search index is derived only from `src/content/docs` (not pages like benchmarks).
- Branch policy: develop on `dev`; PRs against `dev`; never open PRs against `main`.

## Sources
- `svelte.config.js`
- `src/lib/content/docs.ts`
- `src/lib/content/markdown.ts`
- `src/lib/search/server/content.ts`
- `src/routes/docs/[slug]/+page.server.ts`
- `AGENTS.md`
