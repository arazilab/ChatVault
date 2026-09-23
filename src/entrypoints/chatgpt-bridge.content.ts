import { defineContentScript } from 'wxt/sandbox';

interface BridgeRequest {
  type: 'chatgpt.list';
  requestId: string;
}

export default defineContentScript({
  matches: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    window.addEventListener(
      'message',
      async (event: MessageEvent<BridgeRequest>) => {
        if (
          event.source !== window ||
          event.origin !== window.location.origin ||
          event.data?.type !== 'chatgpt.list'
        )
          return;
        try {
          const response = await fetch(
            '/backend-api/conversations?offset=0&limit=100',
            { credentials: 'include' },
          );
          if (!response.ok)
            throw new Error(
              `ChatGPT request failed with status ${response.status}`,
            );
          const payload: unknown = await response.json();
          const items =
            payload &&
            typeof payload === 'object' &&
            Array.isArray((payload as { items?: unknown }).items)
              ? (payload as { items: unknown[] }).items
              : payload &&
                  typeof payload === 'object' &&
                  Array.isArray(
                    (payload as { conversations?: unknown }).conversations,
                  )
                ? (payload as { conversations: unknown[] }).conversations
                : payload &&
                    typeof payload === 'object' &&
                    Array.isArray((payload as { data?: unknown }).data)
                  ? (payload as { data: unknown[] }).data
                  : Array.isArray(payload)
                    ? payload
                    : [];
          if (items.length === 0 && payload && typeof payload === 'object') {
            const keys = Object.keys(payload).join(', ');
            throw new Error(
              `ChatGPT returned no conversation items. Response fields: ${keys || 'none'}`,
            );
          }
          window.postMessage(
            {
              type: 'chatgpt.list.result',
              requestId: event.data.requestId,
              items,
            },
            window.location.origin,
          );
        } catch (error) {
          window.postMessage(
            {
              type: 'chatgpt.error',
              requestId: event.data.requestId,
              message:
                error instanceof Error ? error.message : 'Request failed',
            },
            window.location.origin,
          );
        }
      },
    );
  },
});
