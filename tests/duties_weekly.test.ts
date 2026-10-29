import { HOSPITALITY_NOT_NEEDED } from '@constants/duties';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  dutiesAssignRecords,
  dutiesHospitalityNotNeeded,
  dutiesHospitalityRecords,
  dutiesPatchSchedule,
  dutyAssignmentForMeeting,
} from '@utils/duties_weekly';
import type { SchedWeekType } from '@definition/schedules';
import { dutiesSchema, scheduleSchema } from '@services/dexie/schema';

const entry = (type: string, value: string, id?: string) => ({
  type,
  value,
  id,
  name: '',
  updatedAt: 'old',
});

test('sharing a custom duty preserves other slots and data views', () => {
  const original = [
    entry('main', 'A', 'custom_1'),
    entry('main', 'B', 'custom_2'),
    entry('group', 'C', 'custom_1'),
  ];
  const saved = dutiesAssignRecords(original, 'D', 'main', 'new', 'custom_1');
  assert.deepEqual(
    saved.map((record) => record.value),
    ['D', 'B', 'C']
  );
  assert.equal(saved[0].updatedAt, 'new');
  assert.equal(original[0].value, 'A');
});

test('clearing a shared duty retains the timestamped record for synchronization', () => {
  const saved = dutiesAssignRecords([entry('main', 'A')], '', 'main', 'new');
  assert.equal(saved.length, 1);
  assert.equal(saved[0].value, '');
  assert.equal(saved[0].updatedAt, 'new');
});

test('first assignment in a data view leaves existing views untouched', () => {
  const saved = dutiesAssignRecords([entry('main', 'A')], 'B', 'group', 'new');
  assert.deepEqual(
    saved.map((record) => [record.type, record.value]),
    [
      ['main', 'A'],
      ['group', 'B'],
    ]
  );
});

test('weekly paths map the same positional or custom duty to each meeting', () => {
  assert.equal(
    dutyAssignmentForMeeting('MM_DUTIES_Audio_2', 'weekend'),
    'WM_DUTIES_Audio_2'
  );
  assert.equal(
    dutyAssignmentForMeeting('WM_DUTIES_Dynamic', 'midweek'),
    'MM_DUTIES_Dynamic'
  );
});

test('applying saved paths preserves intervening edits and microphone sections', () => {
  const original = {
    weekOf: '2026/10/26',
    duties: {
      midweek: {
        audio: { position_1: [entry('main', 'A')] },
        dynamic: [entry('main', 'D', 'section_1')],
        sections: [{ id: 'section' }],
      },
      weekend: {
        audio: { position_1: [entry('main', 'B')] },
        dynamic: [entry('main', 'E', 'section_1')],
        sections: [{ id: 'section' }],
      },
    },
  } as unknown as SchedWeekType;
  const changes = {
    'duties.midweek.audio.position_1': [entry('main', 'C')],
    'duties.weekend.audio.position_1': [entry('main', 'C')],
  };
  const saved = dutiesPatchSchedule(original, changes);
  assert.equal(saved.duties.midweek.audio.position_1[0].value, 'C');
  assert.equal(saved.duties.weekend.audio.position_1[0].value, 'C');
  assert.deepEqual(
    saved.duties.midweek.dynamic,
    original.duties.midweek.dynamic
  );
  assert.deepEqual(
    saved.duties.weekend.sections,
    original.duties.weekend.sections
  );
  assert.equal(original.duties.midweek.audio.position_1[0].value, 'A');
});

const hospitalityWeek = () => ({
  hospitality: dutiesSchema().midweek.hospitality,
  hospitality_not_needed: [] as {
    type: string;
    value: boolean;
    updatedAt: string;
  }[],
});

test('Not needed clears every Hospitality host and never stores a person', () => {
  const week = hospitalityWeek();
  for (const key of Object.keys(week.hospitality)) {
    week.hospitality[key] = [
      entry('main', `host-${key}`),
      entry('group', `group-${key}`),
    ];
  }
  const { positions, flags } = dutiesHospitalityRecords(
    week,
    'position_2',
    HOSPITALITY_NOT_NEEDED,
    'main',
    'new'
  );
  for (const [key, records] of Object.entries(positions)) {
    // older apps read the empty host as unassigned
    assert.equal(records.find((r) => r.type === 'main')?.value, '');
    assert.equal(
      records.find((r) => r.type === 'group')?.value,
      `group-${key}`
    );
  }
  assert.deepEqual(flags, [{ type: 'main', value: true, updatedAt: 'new' }]);
  assert.ok(
    dutiesHospitalityNotNeeded(
      { hospitality: positions, hospitality_not_needed: flags },
      'main'
    )
  );
  assert.ok(
    !dutiesHospitalityNotNeeded(
      { hospitality: positions, hospitality_not_needed: flags },
      'group'
    )
  );
});

test('choosing a host after Not needed lifts the status', () => {
  const week = hospitalityWeek();
  const handled = dutiesHospitalityRecords(
    week,
    'position_1',
    HOSPITALITY_NOT_NEEDED,
    'main',
    'status'
  );
  const needed = dutiesHospitalityRecords(
    { hospitality: handled.positions, hospitality_not_needed: handled.flags },
    'position_1',
    'host',
    'main',
    'assigned'
  );
  assert.deepEqual(
    Object.values(needed.positions).map((records) => records[0].value),
    ['host', '', '', '']
  );
  assert.deepEqual(needed.flags, [
    { type: 'main', value: false, updatedAt: 'assigned' },
  ]);
});

test('a host assigned by an older app wins over Not needed', () => {
  const week = hospitalityWeek();
  week.hospitality_not_needed = [{ type: 'main', value: true, updatedAt: 'x' }];
  assert.ok(dutiesHospitalityNotNeeded(week, 'main'));
  week.hospitality.position_1 = [entry('main', 'host')];
  assert.ok(!dutiesHospitalityNotNeeded(week, 'main'));
});

test('ordinary Hospitality edits preserve other hosts and add no status', () => {
  const week = hospitalityWeek();
  week.hospitality.position_2 = [entry('main', 'second-host')];
  week.hospitality.position_1.push(entry('group', 'group-host'));
  const { positions, flags } = dutiesHospitalityRecords(
    week,
    'position_1',
    'first-host',
    'main',
    'new'
  );
  assert.equal(positions.position_2[0].value, 'second-host');
  assert.equal(
    positions.position_1.find((r) => r.type === 'group')?.value,
    'group-host'
  );
  assert.equal(flags, undefined);
});

test('new weeks carry no duty fields until the first assignment', () => {
  assert.equal('duties' in scheduleSchema, false);
  const week = {
    ...structuredClone(scheduleSchema),
    weekOf: '2026/11/02',
    duties: dutiesSchema(),
  };
  const updated = dutiesPatchSchedule(week, {
    'duties.midweek.audio.position_1': [entry('main', 'A')],
  });
  assert.equal(updated.duties?.midweek.audio.position_1[0].value, 'A');
  assert.deepEqual(updated.duties?.weekend.dynamic, []);
});
