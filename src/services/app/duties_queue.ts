import { createKeyedWriteQueue } from '@utils/async_queue';

/** All writes to a week's duties share this queue, including section changes. */
export const queueDutyWrite = createKeyedWriteQueue();

/** Acquire multiple weeks in a stable order before reading an autofill snapshot. */
export const queueDutyWeeks = <T>(
  weeks: string[],
  write: () => Promise<T>
): Promise<T> => {
  const keys = [...new Set(weeks)].sort();
  const next = (index: number): Promise<T> =>
    index === keys.length
      ? write()
      : queueDutyWrite(keys[index], () => next(index + 1));
  return next(0);
};
