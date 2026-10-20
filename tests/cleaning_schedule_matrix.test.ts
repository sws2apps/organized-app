import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleaningScheduleMatrix } from '../src/utils/cleaning_schedule_matrix';
import type { HallCleaningExportRowType } from '../src/views/activities/hall_cleaning/index.types';

const row: HallCleaningExportRowType = {
  id: 'first',
  date: 'Oct 22',
  weekday: 'Thursday',
  groups: [{ name: 'Group 1', color: '#458A43' }],
  responsible: 'Daniel Carter',
  persons: ['Mia Wilson'],
};

test('matrix reuses identical teams but keeps changed publisher assignments separate', () => {
  const result = cleaningScheduleMatrix([
    row,
    { ...row, id: 'repeat', date: 'Oct 29' },
    { ...row, id: 'changed', persons: ['Noah Bennett'] },
  ]);
  assert.equal(result.groups.length, 2);
  assert.deepEqual(result.turns[0].groups, result.turns[1].groups);
  assert.notDeepEqual(result.turns[0].groups, result.turns[2].groups);
  assert.deepEqual(result.turns[0].label, ['Thursday', 'Oct 22']);
});

test('matrix keeps publisher-only teams and additional activity details', () => {
  const result = cleaningScheduleMatrix([
    { ...row, groups: undefined },
    {
      id: 'garden',
      date: 'Oct 24',
      isMajor: true,
      label: 'Gardening',
      participants: ['Riverside Congregation'],
      responsible: 'Daniel Carter',
      persons: ['Mia Wilson'],
    },
  ]);
  assert.deepEqual(result.groups[0].badges, []);
  assert.deepEqual(result.groups[0].leaders, ['Daniel Carter', 'Mia Wilson']);
  assert.equal(result.groups[1].label, 'Gardening');
  assert.deepEqual(result.groups[1].participants, ['Riverside Congregation']);
  assert.notDeepEqual(result.turns[0].groups, result.turns[1].groups);
});

test('matrix preserves multiple groups and distinct dates even when date labels match', () => {
  const first = {
    ...row,
    groups: [...row.groups!, { name: 'Group 2', color: '#D64D4D' }],
  };
  const result = cleaningScheduleMatrix([first, { ...first, id: 'next-year' }]);
  assert.equal(result.groups[0].badges?.length, 2);
  assert.equal(result.turns.length, 2);
  assert.notEqual(result.turns[0].id, result.turns[1].id);
  assert.deepEqual(cleaningScheduleMatrix([]), { groups: [], turns: [] });
});
