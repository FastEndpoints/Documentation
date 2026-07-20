---
type: Reference
title: Conventions
description: Content frontmatter, naming, formatting, and UI/code style conventions.
tags: [conventions]
---

# Conventions

## Naming
- Doc files: `NN-slug.md` where `NN` is a zero-padded order integer and `slug` becomes the URL segment (`/docs/{slug}`) unless frontmatter `slug` overrides.
- Standalone pages: `src/content/pages/{name}.md` loaded by name (e.g. `benchmarks`).
- SvelteKit routes follow Kit file naming (`+page.svelte`, `+page.server.ts`, `+server.ts`).
- Components: PascalCase `.svelte` under feature folders (`site/`, `docs/`).

## Style
- Prettier: tabs, single quotes, no trailing commas, printWidth 100 (`.prettierrc`).
- TypeScript strict; `noUnusedLocals` / `noUnusedParameters` on.
- ESLint: recommended + `@typescript-eslint` + prettier; lint globs `src/**/*.{ts,js}`, `svelte.config.js`, `vite.config.ts`.
- Tailwind utility classes in components; brand colors via `feBlue` / `feDarkBlue` / `feLightBlue` and CSS vars.
- Dark mode: Tailwind `class` strategy.

## Content (markdown)
Required YAML frontmatter on every content file:
- `title` (string)
- `description` (string)

Optional: `slug`, `order` (defaults come from filename).

Body conventions:
- Title line often `# {$frontmatter.title}` (replaced at load time).
- Code fences: language plus optional `|copy` and `|title=...` (also `+` separators). `cs` maps to C# highlighting.
- Admonitions:
  ```md
  :::admonition type="note"
  body
  :::
  ```
- Headings through `####` feed TOC and search; anchors are slugified (leading digits prefixed with `_`).

## Errors and validation
- Missing/invalid doc filename or frontmatter throws at load/build time.
- Unknown doc slug → 404 via `error(404, ...)`.
- Prerender fails on missing HTML element ids.

## APIs and data
- Prefer `$lib/...` imports.
- Config is frozen object in `src/config.ts` (not env-driven today).
- GitHub contributor fetch fails soft (empty array on non-OK response).

## Config and DI
No DI container. Server load functions call pure content helpers. Client search init is explicit via worker messages.

## Sources
- `.prettierrc`
- `.eslintrc.cjs`
- `src/lib/content/docs.ts`
- `src/lib/content/markdown.ts`
- `tsconfig.json`
