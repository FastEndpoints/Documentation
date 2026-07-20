---
type: Reference
title: Project Overview
description: FastEndpoints documentation site source (SvelteKit static site) for fast-endpoints.com.
tags: [overview]
resource: README.md
---

# Project Overview

## Purpose
Source for the [FastEndpoints](https://fast-endpoints.com) documentation website. Package name: `fast-endpoints-docs`.

## Scope
- Static marketing/home page, docs pages, benchmarks page, client search, sitemap
- Markdown-authored documentation under `src/content/`
- SvelteKit app under `src/` with static adapter output to `docs/`

## Capabilities
- Numbered markdown docs with frontmatter, sidebar, TOC headings
- Custom markdown: Shiki code fences (copy/title meta), admonitions
- Client search over prerendered `search.json` (FlexSearch in a worker)
- Homepage contributor list from GitHub API (build/prerender time)
- SEO/Open Graph via site config; sitemap.xml endpoint

## Status
Active docs site. Development branch is `dev`; `main` is published site. Dev preview: https://dev.fastendpoints-doc-site.pages.dev

## Non-goals
- Not the FastEndpoints .NET library itself (linked separately as API Reference / GitHub)
- No server runtime beyond static hosting after build
- No automated unit/integration test suite in-repo

## Glossary
| Term | Meaning |
| --- | --- |
| Doc page | Markdown under `src/content/docs/NN-slug.md` |
| Page content | Non-sidebar markdown under `src/content/pages/` (e.g. benchmarks) |
| `docs/` | Static build output directory (gitignored), not source content |
| Search blocks | Hierarchical index nodes (title → h2 → h3 → h4) for FlexSearch |

## Sources
- `README.md`
- `package.json`
- `src/config.ts`
- `src/lib/content/docs.ts`
