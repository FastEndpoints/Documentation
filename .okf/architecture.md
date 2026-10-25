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

Component paths and route entry points: [Code Map](code-map.md).

## Dependency rules
- Routes load content via `$lib/content/*` and `$lib/search/server/*` (server/build time filesystem access).
- Client search must not import Node `fs` content loaders; it consumes `/search.json`.
- UI components under `$lib/components`; shared config from `src/config.ts`.
- Do not import from `docs/` build output as source.

## Communication
- No backend API owned by this app after deploy.
- Build/prerender: GitHub REST for contributors (`src/lib/api.ts`).
- Browser: fetch `/search.json`; optional external links (GitHub, Discord, Open Collective, API ref).

## Invariants
- Site is fully prerenderable; missing heading ids fail build (`handleMissingId: 'fail'`).
- `/docs` redirects to `/docs/get-started`.
- Search index is derived only from `src/content/docs` (not pages like benchmarks).

## Sources
- `svelte.config.js`
- `src/lib/content/docs.ts`
- `src/lib/search/server/content.ts`
- `src/routes/docs/[slug]/+page.server.ts`
