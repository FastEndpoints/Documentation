---
type: Playbook
title: Workflows
description: Install, develop, build, lint, format, and typecheck commands for the docs site.
tags: [build]
resource: package.json
---

# Workflows

## Setup
```bash
npm install
```
Node engines are strict (`engine-strict=true` in `.npmrc`). Use a Node version compatible with Vite 8 / SvelteKit 2 / Svelte 5 toolchain in `package.json`.

Branch: work on `dev` only for site changes.

## Build and run
| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (`vite dev`); markdown under `src/content/**` triggers full reload |
| `npm run build` | Production static build into `docs/` |
| `npm run preview` | Preview production build (`vite preview`) |
| `npm run package` | `svelte-kit sync` (Kit generated types/config) |

Homepage contributor load hits GitHub during prerender/build; offline or rate-limited builds may show empty contributors (fetch returns `[]` on failure).

## Lint and format
| Command | Purpose |
| --- | --- |
| `npm run format` | `prettier --write .` |
| `npm run lint` | Prettier check + ESLint on configured globs |
| `npm run check` | `svelte-check` with project tsconfig |
| `npm run check:watch` | Watch mode svelte-check |

## Codegen and migrations
- No DB migrations.
- Content "codegen" is the static build: docs → HTML + `search.json` + `sitemap.xml`.
- After adding routes or deps that affect Kit types, run `npm run package` or a build/dev cycle.

## Common content workflow
1. Add or edit `src/content/docs/NN-slug.md` (or `src/content/pages/*.md`).
2. Run `npm run dev` and verify page, sidebar order, anchors, search.
3. Run `npm run check` / `npm run lint` before PR.
4. Open PR against `dev`.

## Sources
- `package.json`
- `vite.config.ts`
- `svelte.config.js`
- `AGENTS.md`
