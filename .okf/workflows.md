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
npm ci
```
Use the locked toolchain's Node requirements in [Dependencies](dependencies.md). Use `npm install` when intentionally changing dependencies.

## Build and run
| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (`vite dev`); markdown under `src/content/**` triggers full reload |
| `npm run build` | Production static build into `docs/` |
| `npm run preview` | Preview production build (`vite preview`) |
| `npm run package` | `svelte-kit sync`; refresh generated Kit types/config after route or relevant dependency changes (build/dev also syncs) |

Build-time GitHub access and failure behavior: [Operations](operations.md).

## Lint and format
| Command | Purpose |
| --- | --- |
| `npm run format` | `prettier --write .` |
| `npm run lint` | Prettier check + ESLint on configured globs |

Validation commands and content/UI checks: [Testing](testing.md). Markdown is excluded from Prettier checks and formatting.

## Sources
- `package.json`
- `vite.config.ts`
- `svelte.config.js`
