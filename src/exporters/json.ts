import type { Archive } from '../archive/schema';

export function exportJson(archive: Archive): string {
  return `${JSON.stringify(archive, null, 2)}\n`;
}
