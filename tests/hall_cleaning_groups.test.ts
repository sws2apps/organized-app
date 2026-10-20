import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  updateHallCleaningGroupEntry,
  hallCleaningGroupCount,
  hallCleaningGroupEntries,
  hallCleaningRotationOrder,
  resolveHallCleaningGroups,
} from '../src/utils/hall_cleaning_groups';
const entry = (value: string, id?: string, type = 'main') => ({
  value,
  id,
  type,
  name: value,
  updatedAt: '',
});
const valid = (value: string) => ['a', 'b', 'c', 'd', 'e', 'f'].includes(value);

test('the group amount defaults to one and is bounded from one to six', () => {
  assert.equal(hallCleaningGroupCount(), 1);
  for (const value of [0, -2, NaN, 1.5])
    assert.equal(hallCleaningGroupCount(value), 1);
  assert.equal(hallCleaningGroupCount(20), 6);
});

test('position-based reads preserve legacy first groups, hidden positions and other views', () => {
  const records = [
    entry('a'),
    entry('b', '2'),
    entry('c', '3'),
    entry('d', undefined, 'other'),
  ];
  const before = structuredClone(records);
  assert.deepEqual(
    hallCleaningGroupEntries(records, 'main', 2).map((e) => e?.value),
    ['a', 'b']
  );
  assert.deepEqual(records, before);
  assert.equal(hallCleaningGroupEntries(records, 'other', 1)[0]?.value, 'd');
  assert.equal(hallCleaningGroupEntries(records, 'main', 6)[5], undefined);
});

test('rotation advances whole batches and does not repeat groups within a cleaning', () => {
  const groups = ['a', 'b', 'c', 'd'];
  assert.deepEqual(hallCleaningRotationOrder(groups, 0, 2).slice(0, 2), [
    'a',
    'b',
  ]);
  assert.deepEqual(hallCleaningRotationOrder(groups, 1, 2).slice(0, 2), [
    'c',
    'd',
  ]);
  assert.deepEqual(hallCleaningRotationOrder(groups, 2, 2).slice(0, 2), [
    'a',
    'b',
  ]);
  const six = resolveHallCleaningGroups(
    Array(6),
    hallCleaningRotationOrder(groups, 0, 6),
    valid
  );
  assert.deepEqual(
    six.map((g) => g.value),
    ['a', 'b', 'c', 'd', '', '']
  );
  assert.deepEqual(hallCleaningRotationOrder([], 2, 3), []);
});

test('manual selections remain first-class and automatic positions avoid them', () => {
  const stored = [entry('b'), undefined, entry('f', '3')];
  const before = structuredClone(stored);
  const selected = resolveHallCleaningGroups(
    stored,
    ['a', 'b', 'c', 'd'],
    valid
  );
  assert.deepEqual(selected, [
    { value: 'b', manual: true },
    { value: 'a', manual: false },
    { value: 'f', manual: true },
  ]);
  assert.deepEqual(stored, before);
});

test('deleted groups leave their turn open without shifting other positions', () => {
  const selected = resolveHallCleaningGroups(
    [undefined, undefined],
    ['deleted', 'b', 'c'],
    valid
  );
  assert.deepEqual(
    selected.map((g) => g.value),
    ['', 'b']
  );
});

test('hidden manual groups do not reserve active positions', () => {
  const records = [entry('a'), entry('b', '2')];
  const visible = hallCleaningGroupEntries(records, 'main', 1);
  assert.deepEqual(resolveHallCleaningGroups(visible, ['b', 'c', 'd'], valid), [
    { value: 'a', manual: true },
  ]);
  assert.deepEqual(
    records.map((e) => e.value),
    ['a', 'b']
  );
});

test('updating or clearing one group preserves the first group, hidden positions and other views', () => {
  const original = [
    entry('a'),
    entry('b', '2'),
    entry('c', '6'),
    entry('d', '2', 'other'),
  ];
  const before = structuredClone(original);
  const changed = updateHallCleaningGroupEntry(original, entry('f'), 2);
  assert.deepEqual(
    changed.map((e) => [e.type, e.id, e.value]),
    [
      ['main', undefined, 'a'],
      ['main', '2', 'f'],
      ['main', '6', 'c'],
      ['other', '2', 'd'],
    ]
  );
  assert.deepEqual(original, before);
  const cleared = updateHallCleaningGroupEntry(changed, entry(''), 2);
  assert.equal(cleared.length, original.length);
  assert.equal(cleared[1].value, '');
  assert.equal(cleared[0].value, 'a');
});

test('adding a second group keeps the legacy first-entry representation', () => {
  const original = [entry('a')];
  const changed = updateHallCleaningGroupEntry(original, entry('b'), 2);
  assert.equal(changed[0].id, undefined);
  assert.equal(changed[1].id, '2');
  assert.equal(original.length, 1);
  assert.throws(
    () => updateHallCleaningGroupEntry(original, entry('b'), 7),
    RangeError
  );
});

test('the configured amount applies only to whole groups in the main congregation', async () => {
  const { hallCleaningConfiguredGroupCount } =
    await import('../src/utils/hall_cleaning_groups');
  const config = {
    type: 'main',
    assign_to: { value: 'group' },
    group_amount: { value: 3 },
  } as import('../src/definition/hall_cleaning').HallCleaningConfig;
  assert.equal(hallCleaningConfiguredGroupCount(config), 3);
  assert.equal(
    hallCleaningConfiguredGroupCount({
      ...config,
      assign_to: { ...config.assign_to, value: 'group_persons' },
    }),
    1
  );
  assert.equal(
    hallCleaningConfiguredGroupCount({
      ...config,
      assign_to: { ...config.assign_to, value: 'persons' },
    }),
    1
  );
  assert.equal(
    hallCleaningConfiguredGroupCount({ ...config, type: 'language-group' }),
    1
  );
  assert.equal(
    hallCleaningConfiguredGroupCount({ ...config, group_amount: undefined }),
    1
  );
});

test('a request for six groups never duplicates the four available groups', () => {
  const resolved = resolveHallCleaningGroups(
    Array.from({ length: 6 }),
    hallCleaningRotationOrder(['a', 'b', 'c', 'd'], 1, 6),
    valid
  );
  assert.deepEqual(
    resolved.map((entry) => entry.value),
    ['c', 'd', 'a', 'b', '', '']
  );
});
