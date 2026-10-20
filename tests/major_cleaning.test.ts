import test from 'node:test';
import assert from 'node:assert/strict';
import {
  majorCleaningScheduleUpdates,
  activeMajorCleanings,
  hasMajorCleaningDateConflict,
  cleaningActivityLabelKey,
} from '../src/utils/major_cleaning';

test('major event selection keeps other views and removed occurrences out', () => {
  const base = {
    date: '2026/10/17',
    participants: [],
    coordinator: '',
    notes: '',
    updatedAt: '',
  };
  assert.deepEqual(
    activeMajorCleanings(
      [
        { ...base, id: 'removed', type: 'main', deleted: true },
        { ...base, id: 'other', type: 'other' },
        { ...base, id: 'active', type: 'main' },
      ],
      'main'
    ).map((event) => event.id),
    ['active']
  );
});

test('one major cleaning per date allows edits, deletion, replacement and separate congregation views', () => {
  const event = {
    id: 'first',
    type: 'main',
    date: '2026/10/17',
    participants: [],
    coordinator: '',
    notes: '',
    updatedAt: '',
  };
  assert.equal(
    hasMajorCleaningDateConflict([event], { ...event, id: 'second' }),
    true
  );
  assert.equal(
    hasMajorCleaningDateConflict([event], { ...event, notes: 'Edited' }),
    false
  );
  assert.equal(
    hasMajorCleaningDateConflict([event], {
      ...event,
      id: 'second',
      date: '2026/10/18',
    }),
    false
  );
  assert.equal(
    hasMajorCleaningDateConflict([event], {
      ...event,
      id: 'second',
      type: 'other',
    }),
    false
  );
  assert.equal(
    hasMajorCleaningDateConflict([{ ...event, deleted: true }], {
      ...event,
      id: 'second',
    }),
    false
  );
  assert.equal(
    hasMajorCleaningDateConflict([event], {
      ...event,
      id: 'second',
      deleted: true,
    }),
    false
  );
});

test('grounds care and combined activities have distinct export labels; old events remain major cleaning', () => {
  assert.equal(cleaningActivityLabelKey(), 'tr_yearlyCleaning');
  assert.equal(cleaningActivityLabelKey('major_cleaning'), 'tr_yearlyCleaning');
  assert.equal(
    cleaningActivityLabelKey('grounds_care'),
    'tr_cleaningGroundsCare'
  );
  assert.equal(
    cleaningActivityLabelKey('cleaning_and_grounds'),
    'tr_cleaningCombined'
  );
});

test('grounds care shares the one-event-per-day constraint with major cleaning', () => {
  const event = {
    id: 'first',
    type: 'main',
    date: '2026/10/17',
    participants: [],
    coordinator: '',
    notes: '',
    updatedAt: '',
  };
  assert.equal(
    hasMajorCleaningDateConflict([event], {
      ...event,
      id: 'garden',
      activity: 'grounds_care',
    }),
    true
  );
  assert.equal(
    hasMajorCleaningDateConflict([event], {
      ...event,
      activity: 'cleaning_and_grounds',
    }),
    false
  );
});

test('moving a special activity keeps its identity and removes only its old active occurrence', () => {
  const event = {
    id: 'move',
    type: 'main',
    date: '2026/10/24',
    participants: [{ id: 'ours', name: 'Riverside' }],
    coordinator: 'Daniel Carter',
    notes: '',
    activity: 'grounds_care' as const,
    updatedAt: 'before',
  };
  const weeks = [
    {
      weekOf: '2026/10/19',
      hall_cleaning: {
        events: [
          event,
          { ...event, type: 'other' },
          { ...event, id: 'different' },
        ],
      },
    },
  ] as unknown as import('../src/definition/schedules').SchedWeekType[];
  const moved = { ...event, date: '2026/11/01', updatedAt: 'after' };
  const before = structuredClone(weeks);
  assert.deepEqual(majorCleaningScheduleUpdates([moved], weeks), [
    {
      weekOf: '2026/10/19',
      event: { ...event, deleted: true, updatedAt: 'after' },
    },
    { weekOf: '2026/10/26', event: moved },
  ]);
  assert.deepEqual(weeks, before);
});

test('moving within the same week updates one event without deleting its new date', () => {
  const event = {
    id: 'move',
    type: 'main',
    date: '2026/10/24',
    participants: [],
    coordinator: '',
    notes: '',
    updatedAt: 'before',
  };
  const weeks = [
    { weekOf: '2026/10/19', hall_cleaning: { events: [event] } },
  ] as unknown as import('../src/definition/schedules').SchedWeekType[];
  const moved = { ...event, date: '2026/10/25', updatedAt: 'after' };
  assert.deepEqual(majorCleaningScheduleUpdates([moved], weeks), [
    { weekOf: '2026/10/19', event: moved },
  ]);
});
