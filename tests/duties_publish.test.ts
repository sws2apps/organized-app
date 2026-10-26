import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sourceSchema } from '@services/dexie/schema';
import {
  mergeDutiesSources,
  filterScheduleByDataView,
} from '@utils/schedule_publish';

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

test('duties publishing preserves already-published programs even when local drafts are newer', () => {
  const remote = structuredClone(sourceSchema);
  remote.weekOf = '2026/10/26';
  remote.midweek_meeting.lc_part3.title = [
    { type: 'main', value: 'Published program', updatedAt: '2026-10-01' },
  ];
  const draft = structuredClone(remote);
  draft.midweek_meeting.lc_part3.title[0] = {
    type: 'main',
    value: 'Unreviewed draft',
    updatedAt: '2026-10-26',
  };
  draft.weekend_meeting.public_talk[0] = {
    type: 'main',
    value: 99,
    updatedAt: '2026-10-26',
  };
  const published = mergeDutiesSources([draft], [remote], '2026/09/01');
  assert.deepEqual(published, [remote]);
  published[0].midweek_meeting.lc_part3.title[0].value = 'changed';
  assert.equal(
    remote.midweek_meeting.lc_part3.title[0].value,
    'Published program'
  );
});

test('a new duties week publishes localized dates without draft songs, talks or event names', () => {
  const draft = structuredClone(sourceSchema);
  draft.weekOf = '2026/10/26';
  draft.midweek_meeting.week_date_locale = { E: 'October 26–November 1' };
  draft.midweek_meeting.event_name = [
    { type: 'group', value: 'Draft event', updatedAt: '2026-10-26' },
  ];
  draft.weekend_meeting.public_talk[0].value = 99;
  draft.weekend_meeting.song_first[0].value = '7';
  const expected = structuredClone(sourceSchema);
  expected.weekOf = draft.weekOf;
  expected.midweek_meeting.week_date_locale = {
    ...draft.midweek_meeting.week_date_locale,
  };
  const published = mergeDutiesSources([draft], [], '2026/09/01');
  assert.deepEqual(published, [expected]);
  published[0].midweek_meeting.week_date_locale.E = 'Changed';
  assert.equal(
    draft.midweek_meeting.week_date_locale.E,
    'October 26–November 1'
  );
});

test('duties publishing retains other published language views and the existing retention window', () => {
  const remote = structuredClone(sourceSchema);
  remote.weekOf = '2026/10/26';
  remote.weekend_meeting.public_talk.push({
    type: 'group',
    value: 77,
    updatedAt: '2026-10-26',
  });
  const old = { ...structuredClone(remote), weekOf: '2026/01/01' };
  assert.deepEqual(mergeDutiesSources([], [old, remote], '2026/09/01'), [
    remote,
  ]);
});
