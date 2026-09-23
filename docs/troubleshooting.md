# Troubleshooting

## ChatGPT shows an error or zero conversations

Build the latest extension with `npm run build`, reload the unpacked extension from `chrome://extensions`, and reload the ChatGPT tab. The extension must be loaded from `.output/chrome-mv3`.

The test button reports authentication failures and unexpected response fields. Do not share cookies, tokens, request headers, or chat contents when reporting a problem. A safe report includes the browser, extension version, URL hostname, and the redacted error text shown by ChatVault.

An empty account should be reported as an empty result only after the bridge confirms that the response contained a recognized conversation list field.
