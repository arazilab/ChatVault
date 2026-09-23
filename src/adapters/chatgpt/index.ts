import { BackupError } from '../../backup/errors';
import type { ChatPlatformAdapter } from '../types';
import { parseConversation, parseConversationSummaries } from './parser';

const CHATGPT_HOSTS = ['chatgpt.com', 'chat.openai.com'] as const;

function requirePageRequest(context: {
  request?: (url: string, signal?: AbortSignal) => Promise<unknown>;
}): (url: string, signal?: AbortSignal) => Promise<unknown> {
  if (!context.request)
    throw new BackupError(
      'platform-changed',
      'ChatGPT page request bridge is not available',
    );
  return context.request;
}

export const chatgptAdapter: ChatPlatformAdapter = {
  id: 'chatgpt',
  displayName: 'ChatGPT',
  hosts: CHATGPT_HOSTS,
  async detect(context) {
    return CHATGPT_HOSTS.includes(
      context.hostname as (typeof CHATGPT_HOSTS)[number],
    );
  },
  async getAccountMetadata() {
    return { platform: 'chatgpt' };
  },
  async listConversations(context, cursor) {
    const request = requirePageRequest(context);
    const url = cursor
      ? `/backend-api/conversations?offset=${encodeURIComponent(cursor)}&limit=100&order=updated&is_archived=false&is_starred=false`
      : '/backend-api/conversations?offset=0&limit=100&order=updated&is_archived=false&is_starred=false';
    const payload = await request(url, context.signal);
    const summaries = parseConversationSummaries(payload);
    return {
      conversations: summaries.map((summary) => ({
        platform: 'chatgpt' as const,
        platformConversationId: summary.id,
        title: summary.title,
        updatedAt: summary.updatedAt,
      })),
      complete: true,
    };
  },
  async getConversation(context, reference) {
    const request = requirePageRequest(context);
    const payload = await request(
      `/backend-api/conversation/${encodeURIComponent(reference.platformConversationId)}`,
      context.signal,
    );
    return parseConversation(payload);
  },
};

export { parseConversation, parseConversationSummaries } from './parser';
