# Archive format

The canonical archive format starts at schema version `1`. Existing versions are immutable. Any incompatible change requires a new version and a migration.

An archive contains `schemaVersion`, `createdAt`, `extensionVersion`, accounts, characters, conversations, and optional platform sections. Timestamps use ISO 8601 strings. Platform-specific values belong under namespaced metadata and must not be silently discarded.

Each account has a platform ID and optional platform account ID and display name. Each conversation has a stable platform conversation ID when available, title, timestamps, optional character ID, metadata, and messages. Each message preserves platform ID, parent ID, role, author, timestamps, text, content parts, attachments, citations, user-visible reasoning, alternatives, edit state, and metadata.

Stable IDs are preferred for idempotency. Fallback IDs must be deterministic, documented, and scoped to the platform and account. Import must reject unknown future schema versions rather than silently reinterpret them.

The ZIP manifest records schema version, creation time, extension version, included platforms, and file checksums. Authentication material is never part of an archive.

