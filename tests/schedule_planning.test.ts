import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  resolveHallCleaningConfig,
  snapshotHallCleaningConfig,
  mergeHallCleaningData,
} from '@utils/hall_cleaning';
import {
  projectScheduleMonth,
  scheduleContent,
  schedulePublicationState,
} from '@utils/schedule_publication';
import type { HallCleaningConfig } from '@definition/hall_cleaning';
import type { SchedWeekType } from '@definition/schedules';

const field = <T>(value: T) => ({ value, updatedAt: '2026-10-01T00:00:00Z' });
const config: HallCleaningConfig = {
  type: 'main',
  _deleted: field(false),
  assign_to: field('group_persons'),
  period: field('meeting'),
  amount: field(3),
  rotation_groups: field(['one', 'two']),
  rotation_unit: field('week'),
  rotation_length: field(1),
  rotation_start: field('2026/10/05'),
};
const week = {
  weekOf: '2026/10/05',
  hall_cleaning: {
    midweek: {
      persons: [
        {
          type: 'main',
          id: '3',
          value: 'person-three',
          name: '',
          updatedAt: '2026-10-01',
        },
      ],
    },
    weekend: {},
    yearly: {},
  },
} as SchedWeekType;

test('a historical snapshot retains period, mode and all positions after defaults change', () => {
  const frozen = snapshotHallCleaningConfig(week, config, '2026-10-12');
  const next = {
    ...config,
    assign_to: field('group' as const),
    period: field('week' as const),
    amount: field(1),
  };
  assert.deepEqual(resolveHallCleaningConfig(frozen, next), config);
  assert.equal(
    frozen.hall_cleaning?.midweek.persons?.[0].value,
    'person-three'
  );
  assert.equal(week.hall_cleaning?.configuration, undefined);
});

test('snapshots own their configuration and preserve other language views', () => {
  const input = structuredClone(config);
  const frozen = snapshotHallCleaningConfig(week, input, 'one');
  input.rotation_groups.value.reverse();
  const other = { ...config, type: 'language-group', amount: field(1) };
  const both = snapshotHallCleaningConfig(frozen, other, 'two');
  assert.deepEqual(
    resolveHallCleaningConfig(both, input).rotation_groups.value,
    ['one', 'two']
  );
  assert.equal(
    resolveHallCleaningConfig(both, undefined, 'language-group')?.amount.value,
    1
  );
  assert.equal(both.hall_cleaning?.configuration?.length, 2);
});

test('legacy schedules fall back to current configuration without inventing history', () => {
  assert.equal(resolveHallCleaningConfig(week, config), config);
  assert.equal(resolveHallCleaningConfig(week, undefined), undefined);
});

test('publication state distinguishes unknown, draft, published and edited content', () => {
  const local = [{ type: 'main', value: 'one', name: '', updatedAt: 'one' }];
  const remote = [
    { updatedAt: 'two', name: 'Published name', value: 'one', type: 'main' },
  ];
  assert.equal(
    schedulePublicationState(local, undefined, 'main', false),
    'unknown'
  );
  assert.equal(
    schedulePublicationState(local, undefined, 'main', true),
    'draft'
  );
  assert.equal(
    schedulePublicationState(local, remote, 'main', true),
    'published'
  );
  assert.equal(
    schedulePublicationState(
      [{ ...local[0], value: '' }],
      remote,
      'main',
      true
    ),
    'changes'
  );
});

test('other language groups do not dirty this view; changed turn order does', () => {
  const local = [
    { type: 'main', value: 'one' },
    { type: 'other', value: 'two' },
  ];
  assert.equal(
    schedulePublicationState(local, [local[0]], 'main', true),
    'published'
  );
  assert.notEqual(
    scheduleContent({ groups: ['one', 'two'] }, 'main'),
    scheduleContent({ groups: ['two', 'one'] }, 'main')
  );
});

test('new cleaning sections are resolved before comparing a successful publication', () => {
  const emptyWeek = { weekOf: '2026/10/19' } as SchedWeekType;
  const published = snapshotHallCleaningConfig(emptyWeek, config, 'published');
  const localProjection = projectScheduleMonth(
    [emptyWeek],
    [],
    '2026/10',
    'hall_cleaning',
    (item) => snapshotHallCleaningConfig(item, config, 'later')
  );
  const remoteProjection = projectScheduleMonth(
    [published],
    [],
    '2026/10',
    'hall_cleaning'
  );
  assert.equal(localProjection.length, 1);
  assert.equal(
    schedulePublicationState(localProjection, remoteProjection, 'main', true),
    'published'
  );
});

test('major event storage order does not make a successful publication dirty', () => {
  const a = {
    id: 'a',
    type: 'main',
    date: '2026/10/17',
    participants: [{ id: 'north', name: 'North' }],
    notes: 'Windows',
  };
  const b = { ...a, id: 'b', date: '2027/01/17' };
  assert.equal(
    schedulePublicationState(
      { events: [a, b] },
      { events: [b, a] },
      'main',
      true
    ),
    'published'
  );
  assert.equal(
    schedulePublicationState(
      { events: [{ ...a, deleted: true }, b] },
      { events: [b, a] },
      'main',
      true
    ),
    'changes'
  );
});

test('inline major cleaning edits and deletions dirty the published snapshot', () => {
  const event = {
    id: 'a',
    type: 'main',
    date: '2026/10/17',
    participants: [{ id: 'own', name: 'Our congregation' }],
    coordinator: 'Alex',
    notes: 'Windows',
    updatedAt: 'first',
  };
  const remote = { events: [event] };
  for (const change of [
    { notes: 'Chairs' },
    { coordinator: 'Jordan' },
    { date: '2026/10/18' },
    { participants: [...event.participants, { id: 'north', name: 'North' }] },
    { deleted: true },
  ]) {
    const draft = { events: [{ ...event, ...change, updatedAt: 'later' }] };
    assert.equal(
      schedulePublicationState(draft, remote, 'main', true),
      'changes'
    );
    assert.equal(
      schedulePublicationState(
        draft,
        JSON.parse(JSON.stringify(draft)),
        'main',
        true
      ),
      'published'
    );
  }
  assert.equal(
    schedulePublicationState(
      { events: [{ ...event, updatedAt: 'later' }] },
      remote,
      'main',
      true
    ),
    'published'
  );
});

test('publication compares positional assignments independently of merge order', () => {
  const entry = (id: string | undefined, value: string) => ({
    id,
    value,
    type: 'main',
    name: 'Group',
    updatedAt: '2026-10-18',
  });
  const first = entry(undefined, 'group-one'),
    second = entry('2', 'group-two'),
    hidden = entry('3', 'group-three');
  const local = { midweek: { group: [second, hidden, first] } };
  const remote = { midweek: { group: [second, first, hidden] } };
  assert.equal(
    schedulePublicationState(local, remote, 'main', true),
    'published'
  );
  assert.equal(
    schedulePublicationState(
      local,
      { midweek: { group: [first, entry('2', 'another-group'), hidden] } },
      'main',
      true
    ),
    'changes'
  );
  assert.notEqual(
    scheduleContent({ rotation_groups: { value: ['one', 'two'] } }, 'main'),
    scheduleContent({ rotation_groups: { value: ['two', 'one'] } }, 'main')
  );
});

test('publishing preserves grounds-care activity and detects an unpublished activity change', () => {
  const event = {
    id: 'garden',
    type: 'main',
    date: '2026/10/17',
    activity: 'grounds_care',
    participants: [{ id: 'ours', name: 'Riverside' }],
    coordinator: 'Daniel',
    updatedAt: '',
  };
  const published = structuredClone({ events: [event] });
  assert.equal(
    schedulePublicationState({ events: [event] }, published, 'main', true),
    'published'
  );
  assert.equal(
    schedulePublicationState(
      { events: [{ ...event, activity: 'cleaning_and_grounds' }] },
      published,
      'main',
      true
    ),
    'changes'
  );
  assert.equal(published.events[0].activity, 'grounds_care');
});

test('publication metadata preserves other views and newer cancelled slots', () => {
  const local = structuredClone(week.hall_cleaning!);
  local.publication = [
    {
      type: 'main',
      slots: [{ slot: 'midweek', date: '2026/10/08' }],
      updatedAt: '2026-10-01',
    },
    {
      type: 'language',
      slots: [{ slot: 'weekend', date: '2026/10/11' }],
      updatedAt: '2026-10-01',
    },
  ];
  const incoming = structuredClone(local);
  incoming.publication = [{ type: 'main', slots: [], updatedAt: '2026-10-02' }];
  const merged = mergeHallCleaningData(local, incoming)!;
  assert.deepEqual(
    merged.publication?.find((entry) => entry.type === 'main')?.slots,
    []
  );
  assert.equal(
    merged.publication?.find((entry) => entry.type === 'language')?.slots[0]
      .date,
    '2026/10/11'
  );
  assert.equal(local.publication[0].slots.length, 1);
});

test('published dates and cancellations are meaningful publication changes', () => {
  const published = {
    publication: [
      {
        type: 'main',
        slots: [{ slot: 'midweek', date: '2026/10/08' }],
        updatedAt: 'old',
      },
    ],
  };
  const identical = structuredClone(published);
  identical.publication[0].updatedAt = 'new';
  assert.equal(
    schedulePublicationState(identical, published, 'main', true),
    'published'
  );
  identical.publication[0].slots[0].date = '2026/10/09';
  assert.equal(
    schedulePublicationState(identical, published, 'main', true),
    'changes'
  );
  identical.publication[0].slots = [];
  assert.equal(
    schedulePublicationState(identical, published, 'main', true),
    'changes'
  );
});

test('a saved future week retains its planning period when the global end is shortened', () => {
  const original = { ...config, rotation_end: field('2027/12/27') };
  const saved = snapshotHallCleaningConfig(
    { ...structuredClone(week), weekOf: '2027/02/01' },
    original,
    '2026-10-21'
  );
  const shortened = { ...original, rotation_end: field('2026/11/02') };
  assert.deepEqual(resolveHallCleaningConfig(saved, shortened), original);
  assert.deepEqual(saved.hall_cleaning?.midweek, week.hall_cleaning?.midweek);
  assert.equal(shortened.rotation_start.value, original.rotation_start.value);
});
