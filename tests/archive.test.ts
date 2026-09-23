import { describe, expect, it } from 'vitest';
import { mergeConversation } from '../src/archive/deduplication';
import { validateConversation } from '../src/archive/validation';
import type { NormalizedConversation } from '../src/archive/schema';

const conversation: NormalizedConversation = {
  platform: 'chatgpt',
  platformConversationId: 'conversation-1',
  title: 'Synthetic conversation',
  messages: [{ platformMessageId: 'message-1', role: 'user', text: 'Hello' }],
};

describe('archive model', () => {
  it('rejects duplicate message IDs', () => {
    expect(() =>
      validateConversation({
        ...conversation,
        messages: [...conversation.messages, ...conversation.messages],
      }),
    ).toThrow('Duplicate message ID');
  });

  it('merges changed messages without duplication', () => {
    const merged = mergeConversation(conversation, {
      ...conversation,
      messages: [
        { platformMessageId: 'message-1', role: 'user', text: 'Edited' },
        { platformMessageId: 'message-2', role: 'assistant', text: 'Hi' },
      ],
    });
    expect(merged.messages).toHaveLength(2);
    expect(merged.messages[0]?.text).toBe('Edited');
  });
});
