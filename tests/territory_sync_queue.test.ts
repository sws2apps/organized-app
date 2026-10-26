import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  coalesceTerritoryChanges,
  matchesTerritoryReview,
  partitionTerritoryChanges,
  TerritoryOperationLimitError,
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

const card = (id: string): Territory => ({
  ...original,
  id,
  assignments: [],
  doNotCalls: [],
});
const update = (id: string) => ({
  ...change('Updated'),
  id,
  before: card(id),
  after: { ...card(id), name: 'Updated' },
});

test('large independent updates, deletions and imports stay within each server batch', () => {
  const updates = Array.from({ length: 41 }, (_, index) =>
    update(String(index))
  );
  for (const changes of [
    updates,
    updates.map((item) => ({ ...item, after: undefined })),
    updates.map((item) => ({ ...item, before: undefined })),
  ]) {
    const batches = partitionTerritoryChanges(changes, true, 20);
    assert.deepEqual(
      batches.map((items) => items.length),
      [20, 20, 1]
    );
    assert.deepEqual(batches.flat(), changes);
  }
});

test('split and combination changes remain atomic and oversized restructuring is rejected', () => {
  const original = update('original');
  for (const member of [
    { ...update('part'), before: undefined },
    { ...update('part'), after: undefined },
  ]) {
    assert.deepEqual(partitionTerritoryChanges([original, member], true, 20), [
      [original, member],
    ]);
    const tooLarge = [
      original,
      ...Array.from({ length: 20 }, (_, index) => ({
        ...member,
        id: String(index),
      })),
    ];
    assert.throws(
      () => partitionTerritoryChanges(tooLarge, true, 20),
      TerritoryOperationLimitError
    );
  }
});

const dncChange = (id: string, count: number) => {
  const before = card(id);
  return {
    ...update(id),
    before,
    after: {
      ...before,
      doNotCalls: Array.from({ length: count }, (_, index) => ({
        id: String(index),
        address: 'Address ' + index,
        addedBy: 'Alice',
        date: '25.10.2026',
      })),
    },
  };
};

test('publisher batches count commands rather than territory records', () => {
  const first = dncChange('first', 12);
  const second = dncChange('second', 12);
  assert.deepEqual(partitionTerritoryChanges([first, second], false, 20), [
    [first],
    [second],
  ]);
  assert.equal(
    partitionTerritoryChanges([dncChange('max', 20)], false, 20).length,
    1
  );
  assert.throws(
    () => partitionTerritoryChanges([dncChange('too-many', 21)], false, 20),
    TerritoryOperationLimitError
  );
});

test('a return and its do-not-call commands never split across revisions', () => {
  const make = (count: number) => {
    const change = dncChange('returned', count);
    const assignment = {
      id: 'assignment',
      publisher: 'Alice',
      assignedOn: '24.10.2026',
      serviceYear: 2027,
      months: 1,
      startMonth: 1,
      endMonth: 1,
    };
    change.before.assignments = [assignment];
    change.after.assignments = [{ ...assignment, returnedOn: '25.10.2026' }];
    return change;
  };
  assert.equal(partitionTerritoryChanges([make(19)], false, 20).length, 1);
  assert.throws(
    () => partitionTerritoryChanges([make(20)], false, 20),
    TerritoryOperationLimitError
  );
});
