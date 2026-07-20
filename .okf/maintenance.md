---
type: Reference
title: Maintenance
description: OKF conformance rules, update triggers, and conflict handling for this repo.
tags: [maintain]
---

# Maintenance

Normative day-to-day OKF finish gates live in `AGENTS.md`. This file is the detailed inventory and conformance reminder.

## Conformance
- OKF v0.1 under `.okf/`.
- Reserved: `index.md` (listing/router; root may only set `okf_version: "0.1"`), optional `log.md` (not used unless requested).
- Every non-reserved `.md` needs YAML frontmatter with non-empty `type` (closed list), `title`, and `description`.
- Allowed types: `Reference`, `Architecture`, `Playbook`, `API Endpoint`, `Database`, `Service`, `Event`, `Security`, `Deployment`, `Generated`, `ADR`.
- At most one `resource` per file; multi-source claims use `## Sources` (1-5 paths).
- No secrets/values in OKF (env/config key names OK).
- No empty placeholders; keep links in `index.md` resolving to existing files only.

## Update triggers
Sync `.okf/` when changes hit:
- architecture/boundaries
- public routes/endpoints/contracts (including search.json / sitemap behavior)
- content pipeline or markdown conventions
- dependencies/runtime/package management
- build/run/lint/format/generate/deploy commands
- testing/validation strategy
- security/auth (if introduced)
- config/env/ports/ops assumptions
- conventions/layout
- gotchas

Pure comment/typo/formatting with no behavior or command change: `OKF unaffected (non-behavioral edit)` is enough.

## Conflicts
If OKF disagrees with source, tests, generated artifacts, or manifests:
1. Verify current behavior from those authorities.
2. Fix OKF.
3. Mention the correction in the final response.

If no OKF update is required, say so explicitly before finishing.

## Sources
- `AGENTS.md`
- `.okf/index.md`
