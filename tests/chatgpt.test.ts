import { describe, expect, it } from 'vitest';
import {
  chatgptAdapter,
  parseConversation,
  parseConversationSummaries,
} from '../src/adapters/chatgpt';
import {
  chatGptConversationFixture,
  chatGptListFixture,
} from './fixtures/chatgpt-conversation';

describe('ChatGPT adapter', () => {
  it('detects supported hosts only', async () => {
    await expect(
      chatgptAdapter.detect({
        url: 'https://chatgpt.com/',
        hostname: 'chatgpt.com',
      }),
    ).resolves.toBe(true);
    await expect(
      chatgptAdapter.detect({
        url: 'https://example.com/',
        hostname: 'example.com',
      }),
    ).resolves.toBe(false);
  });

  it('normalizes mapping nodes and preserves parent IDs', () => {
    const conversation = parseConversation(chatGptConversationFixture);
    expect(conversation.platformConversationId).toBe('chatgpt-conversation-1');
    expect(conversation.messages).toHaveLength(2);
    expect(conversation.messages[1]?.parentId).toBe('message-user');
    expect(conversation.messages[1]?.text).toBe('Hello.');
  });

  it('ignores malformed list records without IDs', () => {
    expect(
      parseConversationSummaries([
        ...chatGptListFixture,
        { title: 'missing ID' },
      ]),
    ).toHaveLength(1);
  });
});
