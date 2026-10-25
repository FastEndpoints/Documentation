---
type: Reference
title: Maintenance
description: OKF conformance, update-trigger inventory, and topic ownership for this repo.
tags: [maintain]
---

# Maintenance

Reading, content discipline, conflict handling, and finish gates: [AGENTS.md](../AGENTS.md).

## Conformance
- OKF v0.1 under `.okf/`.
- Reserved: `index.md` (listing/router; root may only set `okf_version: "0.1"`), optional `log.md` (not used unless requested).
- Every non-reserved `.md` needs YAML frontmatter with non-empty `type` (closed list), `title`, and `description`.
- Allowed types: `Reference`, `Architecture`, `Playbook`, `API Endpoint`, `Database`, `Service`, `Event`, `Security`, `Deployment`, `Generated`, `ADR`.
- At most one `resource` per file; multi-source claims use `## Sources` (1-5 paths).
- No secrets/values in OKF (env/config key names OK).
- No empty placeholders; keep links in `index.md` resolving to existing files only.

## Update triggers
Evaluate OKF when changes affect:
- architecture/boundaries
- public routes/endpoints/contracts (including search.json / sitemap behavior)
- content pipeline or markdown conventions
- dependencies/runtime/package management
- build/run/lint/format/generate/deploy commands
- testing/validation strategy
- persistence/migrations (if introduced)
- security/auth (if introduced)
- config/env/ports/ops assumptions
- conventions/layout
- gotchas

## Topic ownership
- Architecture: build/client boundaries and prerender/search invariants.
- Code map: paths, entry points, and generated artifacts.
- Conventions: content authoring and code style.
- Workflows: setup/build/format commands; testing: validation selection and expectations.
- Dependencies: runtime/package constraints; operations: deployment/configuration and build-time network behavior.
- Gotchas: concise traps not already explained in another topic.

## Sources
- `AGENTS.md`
- `.okf/index.md`
