import { describe, expect, it } from 'vitest';
import { RequestScheduler } from '../src/backup/scheduler';

describe('request scheduler', () => {
  it('limits concurrent work', async () => {
    const scheduler = new RequestScheduler({ concurrency: 1 });
    const order: number[] = [];
    const first = scheduler.run(async () => {
      order.push(1);
      await new Promise((resolve) => setTimeout(resolve, 5));
      order.push(2);
    });
    const second = scheduler.run(async () => order.push(3));
    await Promise.all([first, second]);
    expect(order).toEqual([1, 2, 3]);
  });
});
