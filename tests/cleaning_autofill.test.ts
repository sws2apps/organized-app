import type { SchedWeekType } from '../src/definition/schedules';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleaningMonths } from '../src/views/activities/hall_cleaning/cleaningMonths';
import {
  hallCleaningGroupLoad,
  mergeHallCleaningWeeks,
  mergeHallCleaningData,
  hallCleaningActiveAssignees,
  compareHallCleaningLoad,
  addHallCleaningLoad,
} from '../src/utils/hall_cleaning';

test('cleaning turns count one weekly turn across both meetings', () => {
  const load = hallCleaningGroupLoad([
    { weekOf: '2026/10/12', groups: ['one', 'one'] },
    { weekOf: '2026/10/19', groups: ['two', 'two'] },
    { weekOf: '2026/10/26', groups: ['one', 'two'] },
  ]);
  assert.deepEqual(load.get('one'), { count: 2, last: '2026/10/26' });
  assert.deepEqual(load.get('two'), { count: 2, last: '2026/10/26' });
});

test('hidden positions and another language view do not reserve publishers', () => {
  const used = hallCleaningActiveAssignees(
    [
      { id: '1', type: 'main', value: 'leader', name: '', updatedAt: '' },
      { id: '2', type: 'main', value: '', name: '', updatedAt: '' },
      { id: '3', type: 'main', value: 'hidden', name: '', updatedAt: '' },
      { id: '1', type: 'language', value: 'other', name: '', updatedAt: '' },
    ],
    ['1', '2'],
    'main'
  );
  assert.deepEqual([...used], ['leader']);
});

test('autofill prioritizes the least used, then the longest waiting', () => {
  const load = new Map();
  addHallCleaningLoad(load, 'recent', '2026/10/19');
  addHallCleaningLoad(load, 'older', '2026/10/12');
  addHallCleaningLoad(load, 'twice', '2026/10/05');
  addHallCleaningLoad(load, 'twice', '2026/10/12');
  assert.deepEqual(
    ['twice', 'recent', 'older', 'new'].sort(compareHallCleaningLoad(load)),
    ['new', 'older', 'recent', 'twice']
  );
});

test('month sections keep actual event months and year boundaries', () => {
  const rows = [
    { id: 'one', date: 'Dec 31', month: 'December 2026', persons: [] },
    {
      id: 'major',
      date: 'Jan 2',
      month: 'January 2027',
      persons: [],
      isMajor: true,
    },
    { id: 'two', date: 'Jan 3', month: 'January 2027', persons: [] },
  ];
  assert.deepEqual(
    cleaningMonths(rows).map((section) => [
      section.month,
      section.rows.map((row) => row.id),
    ]),
    [
      ['December 2026', ['one']],
      ['January 2027', ['major', 'two']],
    ]
  );
});

test('legacy preview rows without month metadata remain in one section', () => {
  const rows = [
    { id: 'one', date: 'Oct 15', persons: [] },
    { id: 'two', date: 'Oct 18', persons: [] },
  ];
  assert.deepEqual(cleaningMonths(rows), [{ month: '', rows }]);
});

test('finishing a cleaning save preserves meeting edits made after it started', () => {
  const stale = {
    weekOf: '2026/10/19',
    midweek_meeting: { chairman: 'old' },
    weekend_meeting: { speaker: 'old' },
    duties: { audio: 'old' },
    hall_cleaning: { midweek: { group: [] } },
  } as unknown as SchedWeekType;
  const latest = {
    ...stale,
    midweek_meeting: { chairman: 'new' },
    weekend_meeting: { speaker: 'new' },
    duties: { audio: 'new' },
  } as unknown as SchedWeekType;
  const [merged] = mergeHallCleaningWeeks(
    [latest],
    [{ ...stale, hall_cleaning: { midweek: {}, weekend: {}, yearly: {} } }]
  );
  assert.equal(merged.midweek_meeting, latest.midweek_meeting);
  assert.equal(merged.weekend_meeting, latest.weekend_meeting);
  assert.equal(merged.duties, latest.duties);
  assert.notEqual(merged.hall_cleaning, stale.hall_cleaning);
  assert.equal(latest.hall_cleaning, stale.hall_cleaning);
});

test('moving a cleaning to an unloaded week retains existing weeks and inserts it chronologically', () => {
  const weeks = ['2026/10/19', '2026/11/02'].map(
    (weekOf) => ({ weekOf }) as SchedWeekType
  );
  const moved = {
    weekOf: '2026/10/26',
    hall_cleaning: { midweek: {}, weekend: {}, yearly: {} },
  } as SchedWeekType;
  const result = mergeHallCleaningWeeks(weeks, [moved]);
  assert.deepEqual(
    result.map((week) => week.weekOf),
    ['2026/10/19', '2026/10/26', '2026/11/02']
  );
  assert.equal(result[0], weeks[0]);
  assert.equal(result[2], weeks[1]);
  assert.deepEqual(result[1].hall_cleaning, moved.hall_cleaning);
});

test('a stale cleaning save preserves newer positions, other views and deleted activities', () => {
  const entry = (
    id: string,
    value: string,
    updatedAt: string,
    type = 'main'
  ) => ({ id, type, value, name: '', updatedAt });
  const current = {
    midweek: {
      persons: [
        entry('1', 'new', '2026-10-19T10:00:00Z'),
        entry('2', 'other-view', '2026-10-19T10:00:00Z', 'language'),
      ],
    },
    weekend: {},
    yearly: {},
    events: [
      {
        id: 'event',
        type: 'main',
        date: '2026/10/24',
        participants: [],
        coordinator: '',
        notes: '',
        updatedAt: '2026-10-19T10:00:00Z',
        deleted: true,
      },
    ],
  };
  const incoming = {
    midweek: {
      persons: [
        entry('1', 'stale', '2026-10-19T09:00:00Z'),
        entry('3', 'new-slot', '2026-10-19T11:00:00Z'),
      ],
    },
    weekend: {},
    yearly: {},
    events: [
      {
        ...current.events[0],
        updatedAt: '2026-10-19T09:00:00Z',
        deleted: false,
      },
    ],
  };
  const merged = mergeHallCleaningData(current, incoming)!;
  assert.deepEqual(
    merged.midweek.persons?.map((e) => e.value),
    ['new', 'other-view', 'new-slot']
  );
  assert.equal(merged.events?.[0].deleted, true);
  assert.equal(incoming.midweek.persons[0].value, 'stale');
});

test('an explicit newer cleared assignment wins over a saved older publisher', () => {
  const entry = {
    id: '1',
    type: 'main',
    value: 'person',
    name: '',
    updatedAt: '2026-10-19T09:00:00Z',
  };
  const current = { midweek: { persons: [entry] }, weekend: {}, yearly: {} };
  const incoming = {
    midweek: {
      persons: [{ ...entry, value: '', updatedAt: '2026-10-19T10:00:00Z' }],
    },
    weekend: {},
    yearly: {},
  };
  assert.equal(
    mergeHallCleaningData(current, incoming)?.midweek.persons?.[0].value,
    ''
  );
});
