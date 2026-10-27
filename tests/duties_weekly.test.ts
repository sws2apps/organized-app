import { HOSPITALITY_NOT_NEEDED } from '@constants/duties';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  dutiesAssignRecords,
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

test('Not needed handles every Hospitality position without affecting another language group', () => {
  const positions = Object.fromEntries(
    [1, 2, 3, 4].map((n) => [
      `position_${n}`,
      [entry('main', `host-${n}`), entry('group', `group-host-${n}`)],
    ])
  ) as import('@definition/schedules').DutyPositionsType;
  const saved = dutiesHospitalityRecords(
    positions,
    'position_2',
    HOSPITALITY_NOT_NEEDED,
    'main',
    'new'
  );
  for (const [key, records] of Object.entries(saved)) {
    assert.equal(
      records.find((r) => r.type === 'main')?.value,
      HOSPITALITY_NOT_NEEDED
    );
    assert.equal(records.find((r) => r.type === 'main')?.updatedAt, 'new');
    assert.equal(
      records.find((r) => r.type === 'group')?.value,
      positions[key].find((r) => r.type === 'group')?.value
    );
  }
  assert.equal(positions.position_2[0].value, 'host-2');
});

test('choosing a host after Not needed clears the status from every other Hospitality slot', () => {
  const positions = dutiesSchema().midweek.hospitality;
  const handled = dutiesHospitalityRecords(
    positions,
    'position_1',
    HOSPITALITY_NOT_NEEDED,
    'main',
    'status'
  );
  const needed = dutiesHospitalityRecords(
    handled,
    'position_1',
    'host',
    'main',
    'assigned'
  );
  assert.deepEqual(
    Object.values(needed).map((records) => records[0].value),
    ['host', '', '', '']
  );
  assert.ok(
    Object.values(needed).every(
      (records) => records[0].updatedAt === 'assigned'
    )
  );
});

test('clearing Not needed makes all configured Hospitality positions unassigned again', () => {
  const handled = dutiesHospitalityRecords(
    dutiesSchema().midweek.hospitality,
    'position_1',
    HOSPITALITY_NOT_NEEDED,
    'main',
    'status'
  );
  const empty = dutiesHospitalityRecords(
    handled,
    'position_1',
    '',
    'main',
    'cleared'
  );
  assert.ok(
    Object.values(empty).every(
      (records) => records[0].value === '' && records[0].updatedAt === 'cleared'
    )
  );
});

test('ordinary Hospitality edits preserve other hosts and groups', () => {
  const positions = dutiesSchema().midweek.hospitality;
  positions.position_2 = [entry('main', 'second-host')];
  positions.position_1.push(entry('group', 'group-host'));
  const saved = dutiesHospitalityRecords(
    positions,
    'position_1',
    'first-host',
    'main',
    'new'
  );
  assert.equal(saved.position_2[0].value, 'second-host');
  assert.equal(
    saved.position_1.find((r) => r.type === 'group')?.value,
    'group-host'
  );
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
