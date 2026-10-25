import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  coalesceTerritoryChanges,
  matchesTerritoryReview,
} from '../src/utils/territory_sync_queue';
import type { TerritoryPendingOperation } from '../src/definition/territory_sync';
import type { Territory } from '../src/definition/territory';
const original = { id: 'a', name: 'Original' } as Territory;
const change = (name: string) => ({
  id: 'main:a',
  dataView: 'main',
  before: original,
  after: { ...original, name },
  baseRevision: 3,
});
test('correcting an unsent migration preserves its original revision and replaces the draft', () => {
  const queue: TerritoryPendingOperation[] = [
    { id: 'one', changes: [change('Old')] },
  ];
  assert.equal(coalesceTerritoryChanges(queue, [change('Corrected')]), true);
  assert.equal(queue[0].changes[0].after?.name, 'Corrected');
  assert.equal(queue[0].changes[0].baseRevision, 3);
});
test('a prepared payload is immutable, even after a lost response', () => {
  const queue: TerritoryPendingOperation[] = [
    {
      id: 'one',
      changes: [change('Old')],
      prepared: { operationId: 'one', expectedRevision: 3, commands: [] },
    },
  ];
  assert.equal(coalesceTerritoryChanges(queue, [change('New')]), false);
  assert.equal(queue[0].changes[0].after?.name, 'Old');
});
test('undoing an unsent edit removes its queued change', () => {
  const queue: TerritoryPendingOperation[] = [
    { id: 'one', changes: [change('Old')] },
  ];
  assert.equal(coalesceTerritoryChanges(queue, [change('Original')]), true);
  assert.equal(queue[0].changes.length, 0);
});

test('review confirmation cannot discard a later coalesced edit with the same operation ID', () => {
  const state = {
    scope: 'cong:alice',
    revision: 3,
    queue: [{ id: 'one', changes: [change('Reviewed')] }],
  };
  const reviewed = structuredClone({ queue: state.queue });
  assert.equal(matchesTerritoryReview(state, reviewed), true);
  coalesceTerritoryChanges(state.queue, [change('Newer edit')]);
  assert.equal(matchesTerritoryReview(state, reviewed), false);
});

test('settings added after a review are protected from discard', () => {
  const state = {
    scope: 'cong:alice',
    revision: 3,
    queue: [],
    settingsDirty: true,
    settings: {
      categories: [],
      borderColor: 'red' as const,
      borderDashed: false,
      recommendations: { cooldownMonths: 0, categories: [], types: [] },
      overdueMonths: 4,
    },
  };
  assert.equal(matchesTerritoryReview(state, { queue: [] }), false);
  assert.equal(
    matchesTerritoryReview(state, { queue: [], settings: state.settings }),
    true
  );
});
