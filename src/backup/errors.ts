export type BackupErrorCode =
  | 'authentication-required'
  | 'rate-limited'
  | 'platform-changed'
  | 'conversation-unavailable'
  | 'partial-history'
  | 'network-failure'
  | 'parse-failure'
  | 'cancelled'
  | 'storage-failure';

export class BackupError extends Error {
  constructor(
    readonly code: BackupErrorCode,
    message: string,
    readonly retryable = false,
  ) {
    super(message);
    this.name = 'BackupError';
  }
}
