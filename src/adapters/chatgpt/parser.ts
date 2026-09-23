import type { Message, NormalizedConversation } from '../../archive/schema';
import { BackupError } from '../../backup/errors';

interface ChatGptNode {
  id?: unknown;
  parent?: unknown;
  message?: {
    id?: unknown;
    author?: { role?: unknown; name?: unknown };
    create_time?: unknown;
    update_time?: unknown;
    content?: { parts?: unknown };
    metadata?: unknown;
  } | null;
}

interface ChatGptConversationPayload {
  conversation_id?: unknown;
  title?: unknown;
  create_time?: unknown;
  update_time?: unknown;
  mapping?: Record<string, ChatGptNode>;
  model?: unknown;
  metadata?: unknown;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asTimestamp(value: unknown): string | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Date(value * 1000).toISOString()
    : asString(value);
}

function messageText(parts: unknown): string {
  if (!Array.isArray(parts)) return '';
  return parts
    .filter((part): part is string => typeof part === 'string')
    .join('');
}

function role(value: unknown): Message['role'] {
  return value === 'user' ||
    value === 'assistant' ||
    value === 'system' ||
    value === 'tool'
    ? value
    : 'unknown';
}

export function parseConversation(payload: unknown): NormalizedConversation {
  if (!payload || typeof payload !== 'object')
    throw new BackupError(
      'parse-failure',
      'ChatGPT conversation was not an object',
    );
  const value = payload as ChatGptConversationPayload;
  const id = asString(value.conversation_id);
  if (!id || !value.mapping || typeof value.mapping !== 'object') {
    throw new BackupError(
      'parse-failure',
      'ChatGPT conversation has no stable ID or message mapping',
    );
  }

  const messages: Message[] = [];
  for (const [nodeId, node] of Object.entries(value.mapping)) {
    const source = node.message;
    if (!source) continue;
    const messageId = asString(source.id) ?? nodeId;
    messages.push({
      platformMessageId: messageId,
      parentId: asString(node.parent),
      role: role(source.author?.role),
      author: asString(source.author?.name),
      createdAt: asTimestamp(source.create_time),
      updatedAt: asTimestamp(source.update_time),
      text: messageText(source.content?.parts),
      metadata:
        source.metadata && typeof source.metadata === 'object'
          ? (source.metadata as Record<string, unknown>)
          : undefined,
    });
  }

  messages.sort((left, right) =>
    (left.createdAt ?? '').localeCompare(right.createdAt ?? ''),
  );
  return {
    platform: 'chatgpt',
    platformConversationId: id,
    title: asString(value.title) ?? 'Untitled conversation',
    createdAt: asTimestamp(value.create_time),
    updatedAt: asTimestamp(value.update_time),
    model: asString(value.model),
    metadata:
      value.metadata && typeof value.metadata === 'object'
        ? (value.metadata as Record<string, unknown>)
        : undefined,
    messages,
  };
}

export interface ChatGptConversationSummary {
  id: string;
  title: string;
  updatedAt?: string;
}

export function parseConversationSummaries(
  payload: unknown,
): ChatGptConversationSummary[] {
  if (!Array.isArray(payload))
    throw new BackupError(
      'parse-failure',
      'ChatGPT conversation list was not an array',
    );
  return payload.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const value = item as Record<string, unknown>;
    const id = asString(value.id);
    if (!id) return [];
    return [
      {
        id,
        title: asString(value.title) ?? 'Untitled conversation',
        updatedAt: asTimestamp(value.update_time),
      },
    ];
  });
}
