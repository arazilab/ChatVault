export interface SchedulerOptions {
  concurrency?: number;
  delayMs?: number;
}

export class RequestScheduler {
  private active = 0;
  private readonly queue: Array<() => void> = [];
  private readonly concurrency: number;
  private readonly delayMs: number;

  constructor(options: SchedulerOptions = {}) {
    this.concurrency = Math.max(1, options.concurrency ?? 2);
    this.delayMs = Math.max(0, options.delayMs ?? 0);
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      this.queue.push(resolve);
      this.drain();
    });
    try {
      return await task();
    } finally {
      this.active -= 1;
      this.drain();
    }
  }

  private drain(): void {
    while (this.active < this.concurrency && this.queue.length > 0) {
      this.active += 1;
      const resolve = this.queue.shift();
      if (resolve) setTimeout(resolve, this.delayMs);
    }
  }
}
