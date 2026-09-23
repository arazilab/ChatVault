import type { NormalizedConversation } from './schema';

export function mergeConversation(
  previous: NormalizedConversation | undefined,
  incoming: NormalizedConversation,
): NormalizedConversation {
  if (!previous) return incoming;
  const messages = new Map(
    previous.messages.map((message) => [message.platformMessageId, message]),
  );
  for (const message of incoming.messages)
    messages.set(message.platformMessageId, message);
  return { ...previous, ...incoming, messages: [...messages.values()] };
}
