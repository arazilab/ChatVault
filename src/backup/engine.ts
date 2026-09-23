import type { ChatPlatformAdapter, AdapterContext } from '../adapters/types';
import { validateConversation } from '../archive/validation';
import type { NormalizedConversation } from '../archive/schema';
import { BackupError } from './errors';
import { RequestScheduler } from './scheduler';

export interface BackupProgress {
  stage: 'discovering' | 'downloading' | 'saving' | 'complete';
  completed: number;
  total: number;
  failed: number;
}

export interface BackupResult {
  conversations: NormalizedConversation[];
  failures: Array<{ reference: string; error: BackupError }>;
}

export async function runBackup(
  adapter: ChatPlatformAdapter,
  context: AdapterContext,
  options: {
    onProgress?: (progress: BackupProgress) => void;
    scheduler?: RequestScheduler;
  } = {},
): Promise<BackupResult> {
  const references = [];
  let cursor: string | undefined;
  do {
    const page = await adapter.listConversations(context, cursor);
    references.push(...page.conversations);
    cursor = page.nextCursor;
    options.onProgress?.({
      stage: 'discovering',
      completed: references.length,
      total: references.length,
      failed: 0,
    });
    if (page.complete) break;
  } while (cursor);

  const scheduler = options.scheduler ?? new RequestScheduler();
  const result: BackupResult = { conversations: [], failures: [] };
  let completed = 0;
  await Promise.all(
    references.map(async (reference) => {
      try {
        const conversation = await scheduler.run(() =>
          adapter.getConversation(context, reference),
        );
        validateConversation(conversation);
        result.conversations.push(conversation);
      } catch (error) {
        const backupError =
          error instanceof BackupError
            ? error
            : new BackupError(
                'parse-failure',
                'Conversation could not be normalized',
              );
        result.failures.push({
          reference: reference.platformConversationId,
          error: backupError,
        });
      } finally {
        completed += 1;
        options.onProgress?.({
          stage: 'downloading',
          completed,
          total: references.length,
          failed: result.failures.length,
        });
      }
    }),
  );
  options.onProgress?.({
    stage: 'complete',
    completed,
    total: references.length,
    failed: result.failures.length,
  });
  return result;
}
