import JSZip from 'jszip';
import type { Archive } from '../archive/schema';
import { exportJson } from './json';
import { exportMarkdown } from './markdown';

function safeName(value: string): string {
  return (
    value
      .replace(/[^a-z0-9._-]+/gi, '_')
      .replace(/^\.+/, '_')
      .slice(0, 120) || 'conversation'
  );
}

export async function exportZip(archive: Archive): Promise<Blob> {
  const zip = new JSZip();
  zip.file('manifest.json', exportJson({ ...archive, conversations: [] }));
  for (const conversation of archive.conversations) {
    const directory = `${safeName(conversation.platform)}/conversations`;
    const name = safeName(conversation.platformConversationId);
    zip.file(
      `${directory}/${name}.json`,
      exportJson({ ...archive, conversations: [conversation] }),
    );
    zip.file(`${directory}/${name}.md`, exportMarkdown(conversation));
  }
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}
