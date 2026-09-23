import type { PlatformId } from '../config';

export type JsonObject = Record<string, unknown>;

export interface Account {
  platform: PlatformId;
  platformAccountId?: string;
  displayName?: string;
  metadata?: JsonObject;
}

export interface Character {
  platformCharacterId: string;
  name: string;
  description?: string;
  avatar?: string;
  creator?: string;
  greeting?: string;
  definition?: string;
  metadata?: JsonObject;
}

export interface Message {
  platformMessageId: string;
  parentId?: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | 'unknown';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  text: string;
  contentParts?: readonly JsonObject[];
  attachments?: readonly JsonObject[];
  citations?: readonly JsonObject[];
  reasoning?: string;
  alternatives?: readonly Message[];
  edited?: boolean;
  metadata?: JsonObject;
}

export interface NormalizedConversation {
  platform: PlatformId;
  platformConversationId: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  characterId?: string;
  model?: string;
  metadata?: JsonObject;
  messages: readonly Message[];
}

export interface Archive {
  schemaVersion: number;
  createdAt: string;
  extensionVersion: string;
  accounts: readonly Account[];
  characters: readonly Character[];
  conversations: readonly NormalizedConversation[];
  additionalData?: Readonly<Record<string, JsonObject>>;
}
