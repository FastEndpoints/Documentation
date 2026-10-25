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

## Style
- Code formatting and lint rules are defined in `.prettierrc`, `.eslintrc.cjs`, and `tsconfig.json`.
- `.prettierignore` excludes Markdown, so `npm run format` does not reformat content or OKF. Preserve existing Markdown formatting.
- Tailwind utility classes in components; brand colors via `feBlue` / `feDarkBlue` / `feLightBlue` and CSS vars.
- Dark mode: Tailwind `class` strategy.

## Content (markdown)
Required YAML frontmatter on every content file:
- `title` (string)
- `description` (string)

Docs under `src/content/docs/` also require:
- `group` (must match an id in `src/lib/content/groups.ts`)

Optional: `slug`, `order` (defaults come from filename). Standalone pages in `src/content/pages/` do not use `group`.

Body conventions:
- Title line often `# {$frontmatter.title}` (replaced at load time).
- Code fences: language plus optional `|copy` and `|title=...` (also `+` separators). `cs` maps to C# highlighting.
  Example: `cs |copy|title=Program.cs`.
- Admonitions:
  ```md
  :::admonition type="note"
  body
  :::
  ```
- Headings through `####` feed TOC and search; anchors are slugified (leading digits prefixed with `_`).

## Errors and validation
- Missing/invalid doc filename or frontmatter throws at load/build time (including missing or unknown `group`).
- Unknown doc slug → 404 via `error(404, ...)`.
- Prerender fails on missing HTML element ids.

## APIs and data
- Prefer `$lib/...` imports.
- Config is frozen object in `src/config.ts` (not env-driven today).

## Sources
- `.eslintrc.cjs`
- `src/lib/content/docs.ts`
- `src/lib/content/markdown.ts`
- `tsconfig.json`
