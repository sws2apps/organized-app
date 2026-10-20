import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hallCleaningPlanningWeeks } from '../src/utils/hall_cleaning_planning';

test('planning without materials covers the next calendar and service years', () => {
  const weeks = hallCleaningPlanningWeeks('2026/10/19', new Date(2026, 9, 21));
  assert.equal(weeks[0], '2026/10/19');
  assert.equal(weeks.at(-1), '2028/08/28');
  assert.ok(weeks.includes('2027/12/27'));
  assert.equal(new Set(weeks).size, weeks.length);
});

test('a historical start does not generate historical weeks, including across DST', () => {
  const weeks = hallCleaningPlanningWeeks('2020/01/06', new Date(2026, 2, 25));
  assert.equal(weeks[0], '2026/03/23');
  assert.equal(weeks.at(-1), '2027/12/27');
  assert.deepEqual(weeks.slice(0, 3), ['2026/03/23', '2026/03/30', '2026/04/06']);
});

test('future starts get a complete horizon and invalid dates do not generate weeks', () => {
  const weeks = hallCleaningPlanningWeeks('2027/09/06', new Date(2026, 9, 21));
  assert.equal(weeks[0], '2027/09/06');
  assert.equal(weeks.at(-1), '2029/08/27');
  assert.deepEqual(hallCleaningPlanningWeeks(''), []);
});
