import { defineContentScript } from 'wxt/sandbox';

interface PopupResponse {
  items: unknown[];
  error?: string;
}

export default defineContentScript({
  matches: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
  runAt: 'document_start',
  main() {
    chrome.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        if (
          !message ||
          typeof message !== 'object' ||
          (message as { type?: unknown }).type !== 'chatgpt.list'
        )
          return undefined;
        void fetch(
          '/backend-api/conversations?offset=0&limit=100&order=updated&is_archived=false&is_starred=false',
          {
            credentials: 'include',
          },
        )
          .then(async (response) => {
            if (!response.ok)
              throw new Error(
                `HTTP ${response.status} ${response.statusText || 'request failed'}`,
              );
            const payload: unknown = await response.json();
            const items = extractItems(payload);
            if (items.length === 0)
              throw new Error(
                `ChatGPT returned no conversation items. Response fields: ${responseFields(payload)}`,
              );
            sendResponse({ items });
          })
          .catch((error: unknown) => {
            sendResponse({
              items: [],
              error: error instanceof Error ? error.message : String(error),
            } satisfies PopupResponse);
          });
        return true;
      },
    );
  },
});

function extractItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['items', 'conversations', 'data']) {
    const value = (payload as Record<string, unknown>)[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function responseFields(payload: unknown): string {
  return payload && typeof payload === 'object'
    ? Object.keys(payload).join(', ') || 'none'
    : 'non-object response';
}
