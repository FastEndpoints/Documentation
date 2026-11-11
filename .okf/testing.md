---
type: Playbook
title: Testing
description: No automated test suite; validation is typecheck, lint, and manual/prerender checks.
tags: [test]
---

# Testing

## Frameworks and layout
There is no unit/integration/e2e test suite or test runner configured in `package.json`.

## Integration and data
- Homepage/build checks need GitHub connectivity; failure handling is documented in [Operations](operations.md).
- Search: after content changes, confirm `/search.json` and UI results (dev or preview).

## Expectations
When changing behavior:
1. Run `npm run check` for TypeScript/Svelte correctness (and `npm run lint` for TS/JS/format surfaces).
2. For content or route changes, run `npm run build` (full prerender catches invalid content, routes, and missing ids) or exercise the affected pages with `npm run dev`. Check page rendering, sidebar order, anchors, and search results. For UI/layout changes, exercise affected flows at desktop and mobile sizes.
3. If checks cannot run, state the blocker in the finish summary.

## Sources
- `package.json`
- `svelte.config.js`
