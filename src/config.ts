export const PRODUCT_NAME = 'ChatVault';
export const ARCHIVE_SCHEMA_VERSION = 1;

export const PLATFORM_IDS = [
  'replika',
  'character-ai',
  'janitor-ai',
  'chatgpt',
  'claude',
  'gemini',
  'grok',
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];
