# ChatVault implementation plan

## Goal

Build a local-only Chrome MV3 extension that backs up and exports conversations from seven platforms through isolated adapters and a versioned archive model.

## Phase 0, research and design

- Record prior-art findings and license status in `docs/research/prior-art.md`.
- Define the five-layer architecture in `docs/architecture.md`.
- Define the adapter contract in `docs/adapters.md`.
- Define archive schema and compatibility rules in `docs/archive-format.md`.
- Define privacy and security boundaries in `docs/privacy.md` and `docs/security.md`.
- Mark all platforms as `Implemented, verification needed` until live testing is complete.

## Phase 1, foundation

- Initialize WXT, TypeScript, Vitest, ESLint, Prettier, and MV3 configuration.
- Centralize product name, version, host permissions, and platform identifiers.
- Implement normalized archive types, validation, deterministic identifiers, and migrations.
- Implement IndexedDB repositories and safe transactions.
- Implement the adapter registry, mock adapter, scheduler, backup engine, progress events, cancellation, and typed errors.
- Implement canonical JSON, Markdown, and ZIP exporters.
- Implement a small popup or side panel UI for status, backup, update, refresh, export, and settings.
- Add fixtures and tests for the complete pipeline.

## Phase 2, general assistants

Implement and test one adapter at a time in this order

1. ChatGPT
2. Claude
3. Gemini
4. Grok, including the X interface where feasible

Keep endpoint descriptions, parsers, and platform quirks inside each adapter. Use authenticated browser context only. Do not require provider API keys.

## Phase 3, character platforms

Implement and test one adapter at a time in this order

1. Character.AI
2. JanitorAI
3. Replika

Preserve characters, branches, alternatives, edits, and conversation metadata where exposed. Do not return an empty success when a platform cannot retrieve unavailable history.

## Phase 4, hardening

- Test large archives, interrupted jobs, cancellation, retries, rate limits, malformed data, storage failures, duplicate runs, edited messages, branches, and unavailable conversations.
- Add health and verification metadata to platform status documentation.
- Inspect production permissions and the unpacked build.

## Phase 5, release

- Complete user and contributor documentation.
- Add CI and tagged release workflows.
- Validate package, extension, and tag versions.
- Build a deterministic ZIP and SHA-256 checksums.
- Create the first release only after the V1 acceptance criteria are met.

## Definition of progress

Each phase ends with applicable checks, documentation updates, and a logical commit. Live platform support is not claimed until the relevant adapter has been tested in an authenticated browser session.
