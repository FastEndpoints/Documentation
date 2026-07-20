---
type: Playbook
title: Testing
description: No automated test suite; validation is typecheck, lint, and manual/prerender checks.
tags: [test]
---

# Testing

## Frameworks and layout
There is no unit/integration/e2e test suite or test runner configured in `package.json`.

Validation tools present:
- `svelte-check` (TypeScript + Svelte)
- ESLint + Prettier
- Build-time prerender (missing ids fail; invalid content throws)

## Commands
| Command | Use |
| --- | --- |
| `npm run check` | Primary static correctness check |
| `npm run lint` | Format + ESLint |
| `npm run build` | Full prerender; catches content/route/id issues |
| `npm run dev` | Manual UI/content verification |

## Integration and data
- Contributor API: soft-fail; not required for local content work.
- Search: after content changes, confirm `/search.json` and UI results (dev or preview).

## Expectations
When changing behavior:
1. Run `npm run check` (and `npm run lint` for TS/JS/format surfaces).
2. For content or route changes, run `npm run build` or exercise the affected pages in dev.
3. If checks cannot run, state the blocker in the finish summary.

## Sources
- `package.json`
- `svelte.config.js`
