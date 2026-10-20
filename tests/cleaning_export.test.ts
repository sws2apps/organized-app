import assert from 'node:assert/strict';
import { eachWeekOfInterval, format } from 'date-fns';
import { test } from 'node:test';
import {
  cleaningRotationRanges,
  cleaningExportReady,
  cleaningRotationCalendarRows,
  cleaningYearRange,
} from '../src/utils/hall_cleaning_export';
const range = { start: '2026/10/12', end: '2026/10/26' };
const week = (day: string, a: string[], b = a) => ({
  week: day,
  slots: [
    { date: day, meeting: 'midweek' as const, groups: a },
    { date: day, meeting: 'weekend' as const, groups: b },
  ],
});
test('matching meetings merge consecutive complete weeks with the same group set', () => {
  const result = cleaningRotationRanges(
    [week('2026/10/12', ['b', 'a']), week('2026/10/19', ['a', 'b'])],
    range
  );
  assert.deepEqual(result, [
    {
      id: '2026/10/12',
      start: '2026/10/12',
      end: '2026/10/25',
      groups: ['a', 'b'],
    },
  ]);
});
test('different meetings retain their own groups and meeting labels instead of a union', () => {
  const result = cleaningRotationRanges(
    [week('2026/10/12', ['a'], ['b'])],
    range
  );
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((r) => r.groups),
    [['a'], ['b']]
  );
  assert.deepEqual(
    result.map((r) => r.meeting),
    ['midweek', 'weekend']
  );
});
test('an unassigned meeting never inherits the other meeting group', () => {
  const result = cleaningRotationRanges([week('2026/10/12', ['a'], [])], range);
  assert.equal(result.length, 1);
  assert.equal(result[0].meeting, 'midweek');
});
test('missing or canceled weeks break merged turns', () => {
  const result = cleaningRotationRanges(
    [
      week('2026/10/12', ['a']),
      week('2026/10/19', []),
      week('2026/10/26', ['a']),
    ],
    range
  );
  assert.equal(result.length, 2);
});
test('year boundaries are clipped to the selected calendar year', () => {
  const year = cleaningYearRange(2026);
  assert.equal(year.start, '2025/12/29');
  assert.equal(year.end, '2026/12/28');
  const result = cleaningRotationRanges(
    [week('2025/12/29', ['a']), week('2026/12/28', ['a'])],
    year
  );
  assert.equal(result[0].start, '2026/01/01');
  assert.equal(result[1].end, '2026/12/31');
});
test('a meeting outside the calendar year is excluded without losing the other one', () => {
  const result = cleaningRotationRanges(
    [
      {
        week: '2025/12/29',
        slots: [
          { date: '2025/12/31', meeting: 'midweek', groups: ['a'] },
          { date: '2026/01/04', meeting: 'weekend', groups: ['b'] },
        ],
      },
    ],
    cleaningYearRange(2026)
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].meeting, 'weekend');
  assert.equal(result[0].start, '2026/01/04');
});
test('multiple groups remain distinct and source arrays stay unchanged', () => {
  for (let amount = 1; amount <= 6; amount++) {
    const source = [
      week(
        '2026/10/12',
        Array.from({ length: amount }, (_, i) => String(i))
      ),
    ];
    const before = structuredClone(source);
    const result = cleaningRotationRanges(source, range);
    assert.equal(result[0].groups.length, amount);
    assert.deepEqual(source, before);
  }
});

test('rotation rows split cross-month weeks and use Monday-based weeks of the month', () => {
  const source = [week('2026/12/28', ['a', 'b']), week('2027/01/04', ['b'])];
  const before = structuredClone(source);
  const rows = cleaningRotationCalendarRows(source, {
    start: '2026/12/28',
    end: '2027/01/04',
  });
  assert.deepEqual(
    rows.map(({ month, weekNumber, start, end }) => ({
      month,
      weekNumber,
      start,
      end,
    })),
    [
      {
        month: '2026/12',
        weekNumber: 5,
        start: '2026/12/28',
        end: '2026/12/31',
      },
      {
        month: '2027/01',
        weekNumber: 1,
        start: '2027/01/01',
        end: '2027/01/03',
      },
      {
        month: '2027/01',
        weekNumber: 2,
        start: '2027/01/04',
        end: '2027/01/10',
      },
    ]
  );
  assert.deepEqual(rows[0].groups, ['a', 'b']);
  assert.deepEqual(source, before);
  const singleDay = cleaningRotationCalendarRows([week('2026/10/26', ['a'])], {
    start: '2026/10/26',
    end: '2026/10/26',
  });
  assert.equal(singleDay.at(-1)?.start, '2026/11/01');
  assert.equal(singleDay.at(-1)?.end, '2026/11/01');
});

test('rotation rows preserve different meeting assignments and clip the selected year', () => {
  const rows = cleaningRotationCalendarRows(
    [
      {
        week: '2026/12/28',
        slots: [
          { date: '2026/12/30', meeting: 'midweek', groups: ['a'] },
          { date: '2027/01/03', meeting: 'weekend', groups: ['b'] },
        ],
      },
    ],
    cleaningYearRange(2027)
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].meeting, 'weekend');
  assert.deepEqual(rows[0].groups, ['b']);
  assert.equal(rows[0].weekNumber, 1);
});

test('a full-year rotation covers each calendar day once across month boundaries', () => {
  const year = cleaningYearRange(2027);
  const rows = cleaningRotationCalendarRows(
    eachWeekOfInterval(
      { start: new Date(year.start), end: new Date(year.end) },
      { weekStartsOn: 1 }
    ).map((day) => week(format(day, 'yyyy/MM/dd'), ['a'])),
    year
  );
  const dates: string[] = [];
  for (const row of rows) {
    const day = new Date(row.start.replaceAll('/', '-') + 'T12:00:00Z');
    const end = new Date(row.end.replaceAll('/', '-') + 'T12:00:00Z');
    for (; day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
      dates.push(day.toISOString().slice(0, 10));
    }
  }
  assert.equal(dates.length, 365);
  assert.equal(new Set(dates).size, 365);
  assert.equal(dates[0], '2027-01-01');
  assert.equal(dates.at(-1), '2027-12-31');
});

test('export requires a connected published snapshot and complete selected sections only', () => {
  const base = {
    connected: true,
    publishedAvailable: true,
    cleaning: { selected: true, rangeValid: true, hasAssignments: true },
    rotation: { selected: false, rangeValid: false, hasAssignments: false },
  };
  assert.equal(cleaningExportReady(base), true);
  assert.equal(cleaningExportReady({ ...base, connected: false }), false);
  assert.equal(
    cleaningExportReady({ ...base, publishedAvailable: false }),
    false
  );
  assert.equal(
    cleaningExportReady({
      ...base,
      cleaning: { ...base.cleaning, selected: false },
    }),
    false
  );
  assert.equal(
    cleaningExportReady({
      ...base,
      cleaning: { ...base.cleaning, hasAssignments: false },
    }),
    false
  );
  assert.equal(
    cleaningExportReady({
      ...base,
      rotation: { ...base.rotation, selected: true },
    }),
    false
  );
  assert.equal(
    cleaningExportReady({
      ...base,
      cleaning: { ...base.cleaning, selected: false },
      rotation: { selected: true, rangeValid: true, hasAssignments: true },
    }),
    true
  );
});

test('monthly cards collapse a complete month but keep unpublished gaps visible', async () => {
  const { cleaningRotationMonthlyRows } =
    await import('../src/utils/hall_cleaning_export');
  const january = {
    start: '2026/12/28',
    end: '2027/01/25',
    firstDate: '2027/01/01',
    lastDate: '2027/01/31',
  };
  const weeks = [
    '2026/12/28',
    '2027/01/04',
    '2027/01/11',
    '2027/01/18',
    '2027/01/25',
  ].map((day) => week(day, ['a']));
  const complete = cleaningRotationMonthlyRows(weeks, january);
  assert.equal(complete.length, 1);
  assert.equal(complete[0].fullMonth, true);
  const partial = cleaningRotationMonthlyRows(
    weeks.filter((item) => item.week !== '2027/01/11'),
    january
  );
  assert.equal(partial.length, 2);
  assert.ok(partial.every((row) => !row.fullMonth));
});

test('monthly cards split a continuous assignment at the calendar boundary', async () => {
  const { cleaningRotationMonthlyRows } =
    await import('../src/utils/hall_cleaning_export');
  const rows = cleaningRotationMonthlyRows(
    [week('2027/01/25', ['a']), week('2027/02/01', ['a'])],
    { start: '2027/01/25', end: '2027/02/01' }
  );
  assert.deepEqual(
    rows.map(({ start, end, fullMonth }) => ({ start, end, fullMonth })),
    [
      { start: '2027/01/25', end: '2027/01/31', fullMonth: false },
      { start: '2027/02/01', end: '2027/02/07', fullMonth: false },
    ]
  );
});

test('service-year exports cover September through August and include boundary weeks', () => {
  assert.deepEqual(cleaningYearRange(2027, true), {
    start: '2026/08/31',
    end: '2027/08/30',
    firstDate: '2026/09/01',
    lastDate: '2027/08/31',
  });
  assert.equal(cleaningYearRange(2028, true).lastDate, '2028/08/31');
  assert.equal(cleaningYearRange(2027).firstDate, '2027/01/01');
});
