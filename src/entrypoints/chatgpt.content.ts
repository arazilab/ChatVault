import { defineContentScript } from 'wxt/sandbox';

interface BridgeResponse {
  type: 'chatgpt.list.result' | 'chatgpt.error';
  requestId: string;
  items?: unknown[];
  message?: string;
}

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
        const requestId = crypto.randomUUID();
        let settled = false;
        const handler = (event: MessageEvent<BridgeResponse>) => {
          if (
            settled ||
            event.source !== window ||
            event.data.requestId !== requestId
          )
            return;
          settled = true;
          window.removeEventListener('message', handler);
          if (event.data.type === 'chatgpt.list.result') {
            sendResponse({
              items: event.data.items ?? [],
            } satisfies PopupResponse);
          } else {
            sendResponse({
              items: [],
              error: event.data.message ?? 'ChatGPT request failed',
            } satisfies PopupResponse);
          }
        };
        window.addEventListener('message', handler);
        window.postMessage(
          { type: 'chatgpt.list', requestId },
          window.location.origin,
        );
        window.setTimeout(() => {
          if (settled) return;
          settled = true;
          window.removeEventListener('message', handler);
          sendResponse({
            items: [],
            error: 'Page bridge timed out',
          } satisfies PopupResponse);
        }, 10000);
        return true;
      },
    );
  },
});
