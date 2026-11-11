---
type: Reference
title: Dependencies
description: Node/SvelteKit toolchain, content/search libraries, and package management notes.
tags: [deps]
resource: package.json
---

# Dependencies

## Runtime
- Node ESM project (`"type": "module"`). The locked Vite 8 toolchain requires Node 20.19+ on the 20 line or 22.12+ on the 22 line; the Svelte Vite plugin also supports Node 24+. Check locked package engines before toolchain upgrades.
- Browser static site after build (no Node server required at host)

## Packages
- Manager: npm (`package-lock.json` present)
- `.npmrc`: `engine-strict=true`, `strict-peer-deps=false`

Versions and package inventory belong to `package.json` / `package-lock.json`. Most of the build stack is in `devDependencies`; installing production dependencies alone is insufficient to build the site.

## Constraints
- Local type shim: `types/flexsearch/` and `src/app.d.ts` module declarations for FlexSearch/highlight.js paths.
- Prefer lockfile installs (`npm ci` in CI-like envs) for reproducible builds.

## Sources
- `package.json`
- `package-lock.json`
- `.npmrc`
- `src/app.d.ts`
