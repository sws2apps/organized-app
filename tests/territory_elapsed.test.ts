import assert from 'node:assert/strict';
import { test } from 'node:test';
import { elapsedCalendarDuration } from '../src/utils/territory_dates';
import { formatElapsedDuration } from '../src/services/i18n/translation';

const date = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 23);

test('coverage age counts completed calendar months without rounding up', () => {
  assert.deepEqual(
    elapsedCalendarDuration(date(2026, 7, 30), date(2026, 10, 25)),
    { months: 2, days: 25 }
  );
  assert.deepEqual(
    elapsedCalendarDuration(date(2026, 7, 30), date(2026, 10, 30)),
    { months: 3, days: 0 }
  );
});

test('elapsed dates handle month ends, leap years and year boundaries', () => {
  for (const [start, end, expected] of [
    [date(2026, 1, 31), date(2026, 2, 28), { months: 1, days: 0 }],
    [date(2024, 1, 31), date(2024, 2, 29), { months: 1, days: 0 }],
    [date(2025, 12, 30), date(2026, 1, 25), { months: 0, days: 26 }],
    [date(2025, 7, 30), date(2026, 10, 25), { months: 14, days: 25 }],
    [date(2026, 10, 24), date(2026, 10, 25), { months: 0, days: 1 }],
  ] as const) {
    assert.deepEqual(elapsedCalendarDuration(start, end), expected);
  }
});

test('today and future dates never produce a negative age', () => {
  assert.deepEqual(
    elapsedCalendarDuration(date(2026, 10, 25), date(2026, 10, 25)),
    { months: 0, days: 0 }
  );
  assert.deepEqual(
    elapsedCalendarDuration(date(2026, 10, 26), date(2026, 10, 25)),
    { months: 0, days: 0 }
  );
});

test('duration units and plurals follow the app language', () => {
  assert.equal(formatElapsedDuration(3, 25, 'deu'), '3 Monate, 25 Tage');
  assert.equal(formatElapsedDuration(1, 1, 'deu'), '1 Monat, 1 Tag');
  assert.equal(formatElapsedDuration(2, 25, 'eng'), '2 months, 25 days');
  assert.equal(formatElapsedDuration(3, 0, 'deu'), '3 Monate');
  assert.equal(formatElapsedDuration(0, 1, 'deu'), '1 Tag');
});
