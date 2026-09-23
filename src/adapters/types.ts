import type { PlatformId } from '../config';
import type {
  Account,
  Character,
  JsonObject,
  NormalizedConversation,
} from '../archive/schema';

export interface DetectionContext {
  url: string;
  hostname: string;
}

export interface AdapterContext extends DetectionContext {
  signal?: AbortSignal;
  request?: (url: string, signal?: AbortSignal) => Promise<unknown>;
}

export interface ConversationReference {
  platform: PlatformId;
  platformConversationId: string;
  title?: string;
  updatedAt?: string;
}

export interface ConversationPage {
  conversations: readonly ConversationReference[];
  nextCursor?: string;
  complete: boolean;
}

export interface IncrementalState {
  cursor?: string;
  conversationUpdatedAt?: Readonly<Record<string, string>>;
}

export interface AdditionalPlatformData {
  sections: Readonly<Record<string, JsonObject>>;
}

export interface ChatPlatformAdapter {
  readonly id: PlatformId;
  readonly displayName: string;
  readonly hosts: readonly string[];
  detect(context: DetectionContext): Promise<boolean>;
  getAccountMetadata(context: AdapterContext): Promise<Account | null>;
  listConversations(
    context: AdapterContext,
    cursor?: string,
  ): Promise<ConversationPage>;
  getConversation(
    context: AdapterContext,
    reference: ConversationReference,
  ): Promise<NormalizedConversation>;
  getIncrementalState?(context: AdapterContext): Promise<IncrementalState>;
  getCharacter?(context: AdapterContext, id: string): Promise<Character | null>;
  getAdditionalData?(context: AdapterContext): Promise<AdditionalPlatformData>;
}
