---
okf_version: "0.1"
---

# OKF Knowledge Set

Compact operational knowledge for agents working on the FastEndpoints documentation site. Read relevant files before editing. Keep synchronized with code, content, tests, docs, and configuration.

## Core reading order
* [Project Overview](project-overview.md): purpose and scope
* [Architecture](architecture.md): content pipeline, search, static output
* [Code Map](code-map.md): where routes, content, and libs live
* [Conventions](conventions.md): markdown, naming, style

## Workflow and validation
* [Workflows](workflows.md): install, dev, build, lint, format, check
* [Testing](testing.md): typecheck and lint (no automated test suite)

## Task-specific
* [Dependencies](dependencies.md) · [Operations](operations.md) · [Gotchas](gotchas.md) · [Maintenance](maintenance.md)

## Authority
If OKF conflicts with source, tests, generated artifacts, or manifests: verify those, then update OKF.

## Maintenance
Normative OKF use/update gates: `AGENTS.md`. Reminder + conformance detail: [Maintenance](maintenance.md).
Before finishing, sync OKF when triggers apply; if not needed, state why (`OKF unaffected (non-behavioral edit)` for pure comment/typo/format).
