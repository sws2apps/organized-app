import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runHallCleaningUpdate } from '../src/services/app/hall_cleaning_queue';

test('overlapping cleaning updates read the latest saved state', async () => {
  let state: Record<string, string> = {};
  await Promise.all(
    ['event', 'group', 'settings'].map((field) =>
      runHallCleaningUpdate(async () => {
        const snapshot = { ...state };
        await Promise.resolve();
        state = { ...snapshot, [field]: field };
      })
    )
  );
  assert.deepEqual(state, {
    event: 'event',
    group: 'group',
    settings: 'settings',
  });
});

test('a rejected cleaning save is reported without blocking subsequent edits', async () => {
  const failure = runHallCleaningUpdate(async () => {
    throw new Error('save failed');
  });
  const next = runHallCleaningUpdate(async () => 'saved');
  await assert.rejects(failure, /save failed/);
  assert.equal(await next, 'saved');
});
