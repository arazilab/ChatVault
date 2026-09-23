# ChatVault security model

The extension treats every chatbot page and response as untrusted input. Adapters validate structures before normalization. Export filenames are sanitized. Exporters do not render unsanitized HTML in V1.

The extension never requests cookies permission unless a documented, reviewed requirement makes it unavoidable. It never asks users to paste credentials, cookies, tokens, or authorization headers. Transient request data is not persisted.

Manifest V3 code is packaged with the extension. The extension does not download or execute code. Page-context bridges, if needed, use strict schemas and are isolated from core storage and export code.

Debug logs use IDs and structural information only. Diagnostic reports redact authentication material and conversation text.
