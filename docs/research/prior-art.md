# Prior art research

Research performed on 2026-09-23. The projects below were inspected for architecture, extraction approaches, pagination, export formats, and operational limitations. No source code is copied into this repository.

## Chatbot Manager

Repository: [irsat000/chatbot_manager](https://github.com/irsat000/chatbot_manager)

The repository is primarily an issue and documentation hub for a browser extension that manages chatbot histories. Its public README links to a user guide and shows that Character.AI behavior and user reports are important sources of platform knowledge. The implementation details are not treated as reusable source. License status was not established from the public repository page, so this project is research only.

Useful concept

- Keep platform behavior isolated and use issue reports as a source of known breakage.
- Character platforms need more than the currently visible conversation.

License implication

- No code reuse. License is not established from the inspected public page.

## Hotohori replika_backup

Repository: [Hotohori/replika_backup](https://github.com/Hotohori/replika_backup)

The project is a Python Replika history backup tool. Its README describes an update mode, server ordering, a historical cutoff, and related CSV processing. This supports the need for paginated traversal, incremental updates, explicit completeness limits, and careful ordering.

Useful concept

- Treat server-side history limits as a visible limitation.
- Separate retrieval from post-processing and support updating an existing backup.

License implication

- No code reuse. A repository license was not established from the inspected page.

## devidw replika-chat-export

Repository: [devidw/replika-chat-export](https://github.com/devidw/replika-chat-export)

The README describes a WebSocket transport, authenticated session values, retrieval in chunks of 100 messages, and local JSON output. The authentication instructions are not suitable for this project because this extension must never ask users to paste tokens or credentials. The implementation lesson is to use the existing authenticated page session and keep authentication material transient.

Useful concept

- Chunked history retrieval is practical for large histories.
- WebSocket or frontend transport behavior should be isolated inside the Replika adapter.

License implication

- No code reuse. License was not established from the inspected page.

## Covai Labs ACE

Repository: [Covai-Labs/ace](https://github.com/Covai-Labs/ace)

ACE is a local browser extension with platform-specific code, schemas, tests, and multiple export formats. Its README explicitly describes local processing, no telemetry, no remote dependencies, and normalized JSON output. The public repository page identifies an MPL-2.0 license.

Useful concept

- Keep extraction and export local.
- Maintain platform-specific modules and a normalized export schema.
- Include tests and release tooling in the repository.

License implication

- MPL-2.0 is copyleft at the file level. This project does not copy ACE code or add MPL-2.0 dependencies.

## AfterChat Script

Repository: [AfterThink/AfterChat-Script](https://github.com/AfterThink/AfterChat-Script)

The project is an exporter for major LLM platforms. It is useful as comparative prior art for parser organization, platform-specific extraction, and Markdown export. The inspected public page did not establish a license, so no source is reused.

Useful concept

- Keep parsers close to each platform and make human-readable exports a separate layer.
- Expect DOM and frontend changes, and isolate repair work.

License implication

- No code reuse. License status requires confirmation before any future reuse.

## Chrome Manifest V3

References

- [Chrome permission declarations](https://developer.chrome.com/docs/extensions/mv3/declare_permissions)
- [Extension service workers](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- [Chrome storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)

Design consequences

- Use a Manifest V3 service worker for background coordination.
- Keep executable code inside the extension package and do not load remote code.
- Request only the supported platform host permissions and prefer optional permissions where practical.
- Use IndexedDB for the large archive rather than `chrome.storage.local`, which is better suited to extension settings and small state.
- Design long-running backup jobs as resumable operations because extension service workers are event-driven and may be stopped when idle.

## Independent implementation boundary

The project reuses ideas and publicly observable behavior only. It does not copy code, fixtures, private endpoints, credentials, cookies, or authentication instructions. Any future code reuse requires a separate license review and explicit documentation.
