import type { Archive, NormalizedConversation } from './schema';

export function validateConversation(
  conversation: NormalizedConversation,
): void {
  if (!conversation.platformConversationId.trim())
    throw new Error('Conversation ID is required');
  if (!conversation.title.trim())
    throw new Error('Conversation title is required');
  const ids = new Set<string>();
  for (const message of conversation.messages) {
    if (!message.platformMessageId.trim())
      throw new Error('Message ID is required');
    if (ids.has(message.platformMessageId))
      throw new Error('Duplicate message ID');
    ids.add(message.platformMessageId);
  }
}

export function validateArchive(archive: Archive): void {
  for (const conversation of archive.conversations)
    validateConversation(conversation);
}
