import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hallCleaningPlanningWeeks } from '../src/utils/hall_cleaning_planning';

test('planning without materials stops at the end of the current calendar year', () => {
  const weeks = hallCleaningPlanningWeeks('2026/10/19', new Date(2026, 9, 21));
  assert.equal(weeks[0], '2026/10/19');
  assert.equal(weeks.at(-1), '2026/12/28');
  assert.equal(weeks.length, 11);
  assert.ok(weeks.every((week) => week.startsWith('2026/')));
  assert.equal(new Set(weeks).size, weeks.length);
});

test('a historical start does not generate historical weeks, including across DST', () => {
  const weeks = hallCleaningPlanningWeeks('2020/01/06', new Date(2026, 2, 25));
  assert.equal(weeks[0], '2026/03/23');
  assert.equal(weeks.at(-1), '2026/12/28');
  assert.deepEqual(weeks.slice(0, 3), [
    '2026/03/23',
    '2026/03/30',
    '2026/04/06',
  ]);
});

test('an explicit future start stops in its own calendar year; invalid dates generate nothing', () => {
  const weeks = hallCleaningPlanningWeeks('2027/09/06', new Date(2026, 9, 21));
  assert.equal(weeks[0], '2027/09/06');
  assert.equal(weeks.at(-1), '2027/12/27');
  assert.deepEqual(hallCleaningPlanningWeeks(''), []);
});

test('an explicit end week bounds planning without materials, including next year', () => {
  const today = new Date(2026, 9, 21);
  const short = hallCleaningPlanningWeeks('2026/10/19', today, '2026/11/02');
  const extended = hallCleaningPlanningWeeks('2026/10/19', today, '2027/02/01');
  assert.deepEqual(short, ['2026/10/19', '2026/10/26', '2026/11/02']);
  assert.deepEqual(extended.slice(0, short.length), short);
  assert.equal(extended.at(-1), '2027/02/01');
});

test('expired, reversed, and invalid planning periods generate no weeks', () => {
  const today = new Date(2026, 9, 21);
  assert.deepEqual(
    hallCleaningPlanningWeeks('2026/01/05', today, '2026/10/12'),
    []
  );
  assert.deepEqual(
    hallCleaningPlanningWeeks('2026/11/02', today, '2026/10/26'),
    []
  );
  assert.deepEqual(
    hallCleaningPlanningWeeks('2026/10/19', today, 'invalid'),
    []
  );
});
