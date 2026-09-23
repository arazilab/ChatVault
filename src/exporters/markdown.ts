import type { NormalizedConversation } from '../archive/schema';

export function exportMarkdown(conversation: NormalizedConversation): string {
  const lines = [
    `---`,
    `platform: ${conversation.platform}`,
    `conversation_id: ${conversation.platformConversationId}`,
    `title: ${JSON.stringify(conversation.title)}`,
    `---`,
    '',
    `# ${conversation.title}`,
    '',
  ];
  for (const message of conversation.messages) {
    lines.push(`## ${message.author ?? message.role}`, '', message.text, '');
  }
  return `${lines.join('\n')}\n`;
}
