---
type: Reference
title: Gotchas
description: Non-obvious traps for content, build output, search, and config.
tags: [gotcha]
---

# Gotchas

- **`docs/` is build output**, not markdown source. Source content is `src/content/`. Hand-editing `docs/` is wrong and gitignored.
- Doc filenames must match `NN-slug.md`. Wrong pattern throws at load. Order comes from `NN` (or frontmatter `order`).
- Frontmatter `title` and `description` are mandatory; missing either throws during load/build.
- `/docs` always redirects to `/docs/get-started`; there is no docs index page body.
- Search indexes **docs only** (not `src/content/pages/*` such as benchmarks).
- Markdown HMR: Vite plugin forces full reload on `src/content/**/*.md` changes (not granular HMR).
- Code fence meta: use `copy` and `title=...` after the language (`cs |copy|title=Program.cs`). Language `cs` → csharp for Shiki.
- Heading slugs: leading digit gets `_` prefix (`slugify`); keep TOC/search anchors consistent with rendered ids.
- Prerender entries include `*`, `/search.json`, `/sitemap.xml`; missing element ids fail the build.
- `config.ts` `isProduction` is hardcoded `true`; non-prod siteUrl switching is not automatic.
- Homepage contributors need GitHub network at build/prerender; failures yield empty list, not build failure.
- Branching: develop and PR on `dev` only; never target `main`.
- ESLint ignores `docs/**` and `.svelte-kit/**`; linting build output is not the workflow.
- Algolia keys appear in `src/config.ts`, but in-app search path is FlexSearch over prerendered `search.json`.

## Sources
- `src/lib/content/docs.ts`
- `src/config.ts`
- `svelte.config.js`
- `vite.config.ts`
- `AGENTS.md`
- `.gitignore`
