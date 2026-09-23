# Adapter contract

An adapter is the only place that knows how a supported platform detects the current page, discovers conversations, retrieves records, and interprets platform responses.

```ts
interface ChatPlatformAdapter {
  readonly id: PlatformId;
  readonly displayName: string;
  readonly hosts: readonly string[];
  detect(context: DetectionContext): Promise<boolean>;
  getAccountMetadata(context: AdapterContext): Promise<AccountMetadata | null>;
  listConversations(
    context: AdapterContext,
    cursor?: string,
  ): Promise<ConversationPage>;
  getConversation(
    context: AdapterContext,
    reference: ConversationReference,
  ): Promise<NormalizedConversation>;
  getIncrementalState?(context: AdapterContext): Promise<IncrementalState>;
  getCharacter?(
    context: AdapterContext,
    id: string,
  ): Promise<NormalizedCharacter | null>;
  getAdditionalData?(context: AdapterContext): Promise<AdditionalPlatformData>;
}
```

The exact TypeScript types may evolve, but responsibilities must remain stable. Adapters return normalized records and typed common errors. They do not write IndexedDB data, render UI, or choose export formats.

## Context and transport

`AdapterContext` provides the current tab or page bridge, a request scheduler, cancellation, and a redacted logger. It must not expose a persistence API for secrets. Platform-specific URLs, selectors, response parsers, and pagination rules stay next to the adapter.

Use authenticated same-origin frontend behavior when possible. Never bypass authentication or ask for credentials. Prefer structured state and responses over DOM extraction. DOM extraction is a fallback and must report when it cannot prove completeness.

## Pagination and completeness

`listConversations` returns records, an optional cursor, and completeness information. Cursors are persisted only after the corresponding page is committed. A platform that cannot prove full history must return a partial-history condition or a visible limitation.

Adapters must use bounded scheduling and honor cancellation. A single conversation failure must be represented as a typed item error so the backup engine can continue.

## Normalization requirements

Every conversation needs a stable platform-scoped identifier. Messages should preserve parent relationships, alternatives, edits, attachments, citations, user-visible reasoning, and platform metadata when available. Missing optional fields are represented as absent or null, not fabricated.

Character platforms must preserve character identity and associated metadata when exposed. Multiple histories must not be collapsed into one conversation.

## Contract tests

Every adapter passes the shared contract suite. Tests cover host detection, stable IDs, valid normalized output, chronological consistency, missing optional metadata, malformed responses, pagination, and error translation. Fixtures are synthetic and contain no private user data.

## Adding platform number eight

1. Create an isolated adapter directory.
2. Add the platform ID, display name, hosts, and registry entry.
3. Implement detection, account metadata, conversation listing, and conversation retrieval.
4. Add parsers and sanitized fixtures.
5. Add contract tests and platform-specific behavior tests.
6. Document authentication context, pagination, known limits, and verification date.
7. Update permissions only if required, with a security explanation.
8. Update platform status and user documentation.

The backup engine, storage layer, archive schema, exporters, and UI should not need platform-specific branches.
