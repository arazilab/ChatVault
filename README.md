# ChatVault

ChatVault is an open-source Chrome extension for backing up and exporting conversations from AI chatbot services.

It stores archives locally, supports incremental backup design, and provides portable JSON and Markdown exports. There is no cloud service, telemetry, or subscription.

## Current status

The foundation is implemented. It includes the normalized archive model, adapter contract, local IndexedDB storage, backup orchestration, JSON and Markdown exporters, a basic popup, tests, and a production MV3 build. Live platform adapters are not yet verified.

See [docs/implementation-plan.md](docs/implementation-plan.md) for the phased roadmap and [docs/platform-status.md](docs/platform-status.md) for platform verification status.

## Development

```text
npm ci
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

The production extension is created in `.output/chrome-mv3`. Load that directory as an unpacked extension in Chrome.

## Privacy

Your chat data stays on this device. ChatVault has no backend and does not send chat content to its own servers. Platform pages and frontend interfaces can change, and a backup can be incomplete when the original service does not expose older or deleted content.

## License

ChatVault is released under the MIT License.
