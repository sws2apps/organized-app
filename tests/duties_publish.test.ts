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
