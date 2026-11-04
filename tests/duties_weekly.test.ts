import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  dutiesAssignRecords,
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
