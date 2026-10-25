import { queueDutyWeeks, queueDutyWrite } from '@services/app/duties_queue';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createKeyedWriteQueue } from '@utils/async_queue';
import { dutiesAssignRecords } from '@utils/duties_weekly';
import type { AssignmentCongregation } from '@definition/schedules';

test('rapid custom-duty writes read the latest records after the preceding save', async () => {
  const enqueue = createKeyedWriteQueue();
  const gate = Promise.withResolvers<void>();
  let records: AssignmentCongregation[] = [];
  const save = (id: string, person: string) =>
    enqueue('week', async () => {
      const updated = dutiesAssignRecords(records, person, 'main', 'now', id);
      await gate.promise;
      records = updated;
    });
  const first = save('custom_1', 'A');
  const second = save('custom_2', 'B');
  gate.resolve();
  await Promise.all([first, second]);
  assert.deepEqual(
    records.map((record) => [record.id, record.value]),
    [
      ['custom_1', 'A'],
      ['custom_2', 'B'],
    ]
  );
});

test('failed saves report their error and do not block the next edit', async () => {
  const enqueue = createKeyedWriteQueue();
  const failed = enqueue('week', async () => {
    throw new Error('write failed');
  });
  const next = enqueue('week', async () => 'saved');
  await assert.rejects(failed, /write failed/);
  assert.equal(await next, 'saved');
});

test('saving another week does not wait for an unrelated pending write', async () => {
  const enqueue = createKeyedWriteQueue();
  const gate = Promise.withResolvers<void>();
  const slow = enqueue('week-a', () => gate.promise);
  assert.equal(await enqueue('week-b', async () => 'saved'), 'saved');
  gate.resolve();
  await slow;
});

test('overlapping multi-week operations serialize with single-week writes', async () => {
  const events: string[] = [];
  const gate = Promise.withResolvers<void>();
  const first = queueDutyWeeks(['b', 'a'], async () => {
    events.push('first');
    await gate.promise;
  });
  const second = queueDutyWeeks(['a', 'b'], async () => {
    events.push('second');
  });
  const third = queueDutyWrite('a', async () => {
    events.push('third');
  });
  await Promise.resolve();
  gate.resolve();
  await Promise.all([first, second, third]);
  assert.deepEqual(events, ['first', 'second', 'third']);
});
