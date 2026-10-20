import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleaningMonths } from '../src/views/activities/hall_cleaning/cleaningMonths';
import { cleaningCardLines } from '../src/views/activities/hall_cleaning/cardLines';

const row = (id: string, isMajor = false) => ({
  id,
  date: id,
  persons: [],
  isMajor,
});

test('activity cards share the regular grid without dropping or reordering dates', () => {
  const rows = [
    row('1'),
    row('2'),
    row('major', true),
    ...['3', '4', '5', '6', '7'].map((id) => row(id)),
  ];
  const lines = cleaningCardLines(rows, 4);
  assert.deepEqual(
    lines.map((line) => line.map((entry) => entry.id)),
    [
      ['1', '2', 'major', '3'],
      ['4', '5', '6', '7'],
    ]
  );
  assert.deepEqual(lines.flat(), rows);
});

test('consecutive activities and regular cleaning share the same card row', () => {
  const rows = [
    row('first', true),
    row('second', true),
    row('regular'),
    row('last', true),
  ];
  assert.deepEqual(
    cleaningCardLines(rows, 4).map((line) => line.length),
    [4]
  );
  assert.deepEqual(cleaningCardLines([], 4), []);
});

test('card rows stay within month and year sections without losing a major cleaning', () => {
  const rows = [
    { ...row('dec-regular'), month: 'December 2026' },
    { ...row('dec-major', true), month: 'December 2026' },
    { ...row('jan-first'), month: 'January 2027' },
    { ...row('jan-second'), month: 'January 2027' },
  ];
  const sections = cleaningMonths(rows).map(({ month, rows: entries }) => ({
    month,
    lines: cleaningCardLines(entries, 4),
  }));
  assert.deepEqual(
    sections.map((s) => s.lines.map((line) => line.map((r) => r.id))),
    [[['dec-regular', 'dec-major']], [['jan-first', 'jan-second']]]
  );
  assert.deepEqual(
    sections.flatMap((s) => s.lines.flat()),
    rows
  );
});
