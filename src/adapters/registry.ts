import type { ChatPlatformAdapter } from './types';

const adapters: ChatPlatformAdapter[] = [];

export function registerAdapter(adapter: ChatPlatformAdapter): void {
  if (adapters.some((existing) => existing.id === adapter.id))
    throw new Error(`Adapter already registered: ${adapter.id}`);
  adapters.push(adapter);
}

export function getAdapters(): readonly ChatPlatformAdapter[] {
  return adapters;
}
