import type { NormalizedConversation } from '../archive/schema';

const DATABASE_NAME = 'chatvault';
const DATABASE_VERSION = 1;
const CONVERSATIONS_STORE = 'conversations';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CONVERSATIONS_STORE)) {
        database.createObjectStore(CONVERSATIONS_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open local archive'));
  });
}

export async function saveConversation(
  conversation: NormalizedConversation,
): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(CONVERSATIONS_STORE, 'readwrite');
    transaction.objectStore(CONVERSATIONS_STORE).put({
      key: `${conversation.platform}:${conversation.platformConversationId}`,
      ...conversation,
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('Could not save conversation'));
  });
  database.close();
}

export async function listConversations(): Promise<NormalizedConversation[]> {
  const database = await openDatabase();
  const result = await new Promise<NormalizedConversation[]>(
    (resolve, reject) => {
      const request = database
        .transaction(CONVERSATIONS_STORE)
        .objectStore(CONVERSATIONS_STORE)
        .getAll();
      request.onsuccess = () =>
        resolve(request.result as NormalizedConversation[]);
      request.onerror = () =>
        reject(request.error ?? new Error('Could not read local archive'));
    },
  );
  database.close();
  return result;
}
