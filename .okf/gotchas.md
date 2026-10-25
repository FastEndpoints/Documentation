---
type: Reference
title: Gotchas
description: Non-obvious traps for content, build output, search, and config.
tags: [gotcha]
---

# Gotchas

- **`docs/` is build output**, not markdown source. Source content is `src/content/`. Hand-editing `docs/` is wrong and gitignored.
- Filename/frontmatter rules and code-fence syntax: [Conventions](conventions.md).
- Markdown HMR: Vite plugin forces full reload on `src/content/**/*.md` changes (not granular HMR).
- Heading slugs: leading digit gets `_` prefix (`slugify`); keep TOC/search anchors consistent with rendered ids.
- Preview URL/config and build-time network traps: [Operations](operations.md).

## Sources
- `src/lib/content/slug.ts`
- `vite.config.ts`
- `.gitignore`
