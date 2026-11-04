import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filterScheduleByDataView } from '@utils/schedule_publish';

test('publishing keeps microphone section links and filters assignments by data view', () => {
  const schedule = {
    duties: {
      midweek: {
        sections: [{ id: 'section', parts: ['tgw_talk', 'lc_cbs'] }],
        dynamic: [
          { id: 'section_1', type: 'main', value: 'A' },
          { id: 'section_2', type: 'main', value: 'B' },
          { id: 'section_1', type: 'group', value: 'C' },
        ],
      },
    },
  };
  const published = filterScheduleByDataView(schedule, 'main');
  assert.deepEqual(published.duties.midweek.sections[0].parts, [
    'tgw_talk',
    'lc_cbs',
  ]);
  assert.deepEqual(
    published.duties.midweek.dynamic.map((entry) => entry.value),
    ['A', 'B']
  );
  published.duties.midweek.sections[0].parts.push('opening_prayer');
  assert.equal(schedule.duties.midweek.sections[0].parts.length, 2);
  assert.equal(schedule.duties.midweek.dynamic.length, 3);
});

test('publishing preserves outgoing talks for all views without sharing mutable records', () => {
  const schedule = {
    weekend_meeting: {
      outgoing_talks: [
        { type: 'main', value: 'A' },
        { type: 'group', value: 'B' },
      ],
    },
  };
  const published = filterScheduleByDataView(schedule, 'main');
  assert.equal(published.weekend_meeting.outgoing_talks.length, 2);
  published.weekend_meeting.outgoing_talks[0].value = 'changed';
  assert.equal(schedule.weekend_meeting.outgoing_talks[0].value, 'A');
});

test('publishing preserves empty arrays and scalar source values', () => {
  const source = { parts: [], values: [0, false, '', null], enabled: false };
  assert.deepEqual(filterScheduleByDataView(source, 'main'), source);
});

test('merging keeps duty slots of one data view apart', async () => {
  const { updateObject } = await import('@utils/common');
  const local = {
    dynamic: [
      { id: 'section_1', type: 'main', value: 'A', updatedAt: '1' },
      { id: 'section_2', type: 'main', value: 'B', updatedAt: '1' },
    ],
  };
  const remote = {
    dynamic: [
      { id: 'section_2', type: 'main', value: 'C', updatedAt: '2' },
      { id: 'custom_1', type: 'main', value: 'D', updatedAt: '2' },
    ],
  };
  updateObject(local, remote);
  assert.deepEqual(
    local.dynamic.map((entry) => `${entry.id}=${entry.value}`),
    ['section_1=A', 'section_2=C', 'custom_1=D']
  );
});
