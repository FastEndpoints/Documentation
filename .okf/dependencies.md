---
type: Reference
title: Dependencies
description: Node/SvelteKit toolchain, content/search libraries, and package management notes.
tags: [deps]
resource: package.json
---

# Dependencies

## Runtime
- Node (ESM project: `"type": "module"`)
- Browser static site after build (no Node server required at host)

## Packages
- Manager: npm (`package-lock.json` present)
- `.npmrc`: `engine-strict=true`, `strict-peer-deps=false`

## Key libraries
| Package | Role |
| --- | --- |
| `svelte`, `@sveltejs/kit`, `vite`, `@sveltejs/vite-plugin-svelte` | App framework / bundler |
| `@sveltejs/adapter-static` | Static export to `docs/` |
| `marked`, `gray-matter`, `shiki` | Markdown parse/frontmatter/highlight |
| `flexsearch` | Client search index |
| `github-slugger` | Slug utilities (dependency; project also has local `slugify`) |
| `tailwindcss`, `@tailwindcss/typography`, `postcss`, `autoprefixer` | Styling |
| `nprogress`, `clsx` | UI helpers |
| `typescript`, `svelte-check`, `eslint`, `prettier` | Tooling |

Runtime `dependencies`: `flexsearch`, `marked`. Most stack is `devDependencies` (acceptable for a build-only static site).

## Constraints
- Keep content pipeline on filesystem markdown + existing render helpers unless deliberately redesigning.
- Local type shim: `types/flexsearch/` and `app.d.ts` module declarations for FlexSearch/highlight.js paths.
- Prefer lockfile installs (`npm ci` in CI-like envs) for reproducible builds.

## Sources
- `package.json`
- `.npmrc`
- `src/app.d.ts`
