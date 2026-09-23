# Agent instructions

ChatVault is a privacy-first Chrome extension. Keep changes small, testable, and easy to review.

## Required reading

- Read `docs/architecture.md` before architectural changes.
- Read the affected adapter before editing it.
- Read `docs/adapters.md` before adding or changing an adapter.

## Repository rules

- Keep platform-specific code inside its adapter.
- Never add telemetry, analytics, tracking, remote logging, or external data transmission without explicit approval.
- Never log credentials, cookies, authorization headers, or chat contents.
- Never weaken TypeScript types to silence errors.
- Never disable tests to make CI pass.
- Never update fixtures with real user data.
- Keep Chrome permissions least-privilege.
- Preserve backward compatibility of archive schemas and add migrations for schema changes.
- Add or update tests with behavioral changes.
- Update relevant documentation with behavioral changes.
- Keep changes scoped to the requested task and avoid unrelated refactoring.
- Document newly discovered platform quirks with the verification date.
- Do not guess undocumented platform behavior when it can be inspected or tested.
- Clearly state when a platform implementation has not been live-verified.
- Do not introduce copyleft source without documenting the license consequence and receiving explicit approval.

## Security rules

- Treat page data and platform responses as untrusted input.
- Do not persist or export cookies, bearer tokens, CSRF tokens, or other authentication material.
- Do not use arbitrary `eval` or execute downloaded JavaScript.
- Validate all page bridge messages and external response structures.
- Redact sensitive values from diagnostics and errors.

## Standard commands

Run these before declaring implementation work complete.

```text
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

If a command is not available yet, add the required script as part of the foundation phase. Use Node LTS and keep dependencies minimal.
