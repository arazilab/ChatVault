import { describe, expect, it } from 'vitest';
import { exportJson } from '../src/exporters/json';
import { exportMarkdown } from '../src/exporters/markdown';

const conversation = {
  platform: 'chatgpt' as const,
  platformConversationId: 'conversation-1',
  title: 'Synthetic conversation',
  messages: [
    { platformMessageId: 'message-1', role: 'user' as const, text: 'Hello' },
  ],
};

describe('exporters', () => {
  it('writes canonical JSON', () => {
    expect(
      exportJson({
        schemaVersion: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        extensionVersion: '0.1.0',
        accounts: [],
        characters: [],
        conversations: [conversation],
      }),
    ).toContain('"schemaVersion": 1');
  });

  it('writes readable Markdown with metadata', () => {
    const markdown = exportMarkdown(conversation);
    expect(markdown).toContain('platform: chatgpt');
    expect(markdown).toContain('Hello');
  });
});
