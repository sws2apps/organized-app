import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AssignmentCode as C } from '../src/definition/assignment';
import type { AssignmentConflictContext } from '../src/definition/assignment_conflicts';
import type { AssignmentHistoryType } from '../src/definition/schedules';
import {
  collectAssignmentConflicts,
  assignmentConflictGroup,
  formatAssignmentConflict,
} from '../src/utils/assignment_conflicts';

const held = (
  key: string,
  code: C,
  extra: Partial<AssignmentHistoryType['assignment']> = {}
): AssignmentHistoryType => ({
  id: key,
  weekOf: '2026/10/19',
  assignment: {
    key: key as AssignmentHistoryType['assignment']['key'],
    code,
    title: key,
    person: 'one',
    dataView: 'main',
    ...extra,
  },
});
const context = (
  history: AssignmentHistoryType[],
  extra: Partial<AssignmentConflictContext> = {}
): AssignmentConflictContext => ({
  week: '2026/10/19',
  dataView: 'main',
  assignment: 'MM_DUTIES_Microphone_1',
  code: C.DUTIES_Microphone,
  history,
  sections: { midweek: [], weekend: [] },
  minutes: {},
  ...extra,
});
const result = (
  history: AssignmentHistoryType[],
  extra: Partial<AssignmentConflictContext> = {}
) => collectAssignmentConflicts(context(history, extra)).get('one');
const section = (id: string, parts: string[]) => ({
  id,
  parts,
  name: id,
  amount: 1,
  _deleted: false,
  updatedAt: '',
});

test('microphones can combine with brief reading, talks and demonstrations', () => {
  for (const [key, code] of [
    ['MM_TGWBibleReading_A', C.MM_BibleReading],
    ['MM_TGWTalk', C.MM_TGWTalk],
    ['MM_AYFPart1_Student_A', C.MM_Talk],
    ['MM_AYFPart2_Student_A', C.MM_StartingConversation],
  ] as [string, C][]) {
    assert.equal(result([held(key, code)])?.blocked, false, key);
  }
});

test('microphones never combine with the same audience discussion or study', () => {
  for (const [key, code] of [
    ['MM_TGWGems', C.MM_TGWGems],
    ['MM_LCCBSConductor', C.MM_CBSConductor],
    ['MM_LCCBSReader', C.MM_CBSReader],
    ['WM_WTStudy_Conductor', C.WM_WTStudyConductor],
    ['WM_WTStudy_Reader', C.WM_WTStudyReader],
    ['MM_AYFPart1_Student_A', C.MM_Discussion],
    ['MM_LCPart1', C.MM_LCPart],
  ] as [string, C][]) {
    const weekend = key.startsWith('WM');
    assert.equal(
      result(
        [held(key, code)],
        weekend ? { assignment: 'WM_DUTIES_Microphone_1' } : {}
      )?.blocked,
      true,
      key
    );
  }
});

test('continuous coverage roles do not assume a substitute during a short part', () => {
  for (const code of [
    C.DUTIES_Audio,
    C.DUTIES_Video,
    C.DUTIES_AudioVideo,
    C.DUTIES_Stage,
    C.DUTIES_EntranceAttendant,
    C.DUTIES_AuditoriumAttendant,
    C.DUTIES_VideoconferenceHost,
  ]) {
    assert.equal(
      result([held('MM_TGWBibleReading_A', C.MM_BibleReading)], { code })
        ?.blocked,
      true
    );
  }
});

test('mic shifts respect the selected parts, not just the meeting-wide busy flag', () => {
  const shift = {
    assignment: 'MM_DUTIES_Dynamic',
    scheduleId: 'late_1',
    sections: {
      midweek: [section('late', ['lc_cbs']), section('early', ['tgw_gems'])],
      weekend: [],
    },
  };
  assert.equal(
    result([held('MM_TGWGems', C.MM_TGWGems)], shift)?.blocked,
    false
  );
  assert.equal(
    result([held('MM_LCCBSReader', C.MM_CBSReader)], shift)?.blocked,
    true
  );
  assert.equal(
    result(
      [
        held('MM_DUTIES_Dynamic', C.DUTIES_Microphone, {
          schedule_id: 'early_1',
        }),
      ],
      shift
    )?.blocked,
    false
  );
  assert.equal(
    result(
      [
        held('MM_DUTIES_Dynamic', C.DUTIES_Microphone, {
          schedule_id: 'late_2',
        }),
      ],
      shift
    )?.blocked,
    true
  );
});

test('two different duties at the same time are blocked too', () => {
  assert.equal(
    result([held('MM_DUTIES_Audio_1', C.DUTIES_Audio)])?.blocked,
    true
  );
  assert.equal(
    result([
      held('MM_DUTIES_Dynamic', C.DUTIES_Custom, { schedule_id: 'unknown_1' }),
    ])?.blocked,
    true
  );
});

test('cleaning follows the meeting, so existing duties are workload, not a time clash', () => {
  const cleaning = {
    assignment: 'HC_MM_Dynamic',
    code: C.CLEANING_Hall,
    scheduleId: '1',
  };
  assert.equal(
    result([held('MM_DUTIES_Microphone_1', C.DUTIES_Microphone)], cleaning)
      ?.blocked,
    false
  );
  assert.equal(
    result(
      [held('HC_MM_Dynamic', C.CLEANING_Hall, { schedule_id: '2' })],
      cleaning
    )?.blocked,
    true
  );
});

test('lighter meeting parts rank before longer ones and whole-meeting duties', () => {
  const cleaning = { assignment: 'HC_MM_Dynamic', code: C.CLEANING_Hall };
  const load = (key: string, code: C) =>
    result([held(key, code)], cleaning)!.penalty;
  assert.ok(
    load('MM_OpeningPrayer', C.MM_Prayer) <
      load('MM_TGWBibleReading_A', C.MM_BibleReading)
  );
  assert.ok(
    load('MM_TGWBibleReading_A', C.MM_BibleReading) <
      load('MM_TGWTalk', C.MM_TGWTalk)
  );
  assert.ok(
    load('MM_TGWTalk', C.MM_TGWTalk) <
      load('MM_LCCBSConductor', C.MM_CBSConductor)
  );
  assert.ok(
    load('MM_LCCBSConductor', C.MM_CBSConductor) <
      load('MM_DUTIES_Audio_1', C.DUTIES_Audio)
  );
  assert.equal(
    result([held('MM_AYFPart1_Student_A', C.MM_Talk)], {
      ...cleaning,
      minutes: { ayf_part1: 5 },
    })?.penalty,
    5
  );
});

test('picker categories are free, meeting parts, then duties; mixed entries show all titles', () => {
  assert.equal(assignmentConflictGroup(), 0);
  assert.equal(
    assignmentConflictGroup(result([held('MM_TGWTalk', C.MM_TGWTalk)])),
    1
  );
  const mixed = result([
    held('MM_TGWTalk', C.MM_TGWTalk),
    held('MM_DUTIES_Audio_1', C.DUTIES_Audio),
  ]);
  assert.equal(assignmentConflictGroup(mixed), 2);
  assert.match(mixed!.title, /MM_TGWTalk/);
  assert.match(mixed!.title, /MM_DUTIES_Audio_1/);
});

test('current field, another meeting and another week are not self conflicts', () => {
  assert.equal(
    result([held('MM_DUTIES_Microphone_1', C.DUTIES_Microphone)]),
    undefined
  );
  assert.equal(
    result([held('WM_WTStudy_Reader', C.WM_WTStudyReader)]),
    undefined
  );
  const other = held('MM_TGWGems', C.MM_TGWGems);
  other.weekOf = '2026/10/26';
  assert.equal(result([other]), undefined);
});

test('whole-week cleaning considers both meetings; major cleaning stays independent', () => {
  const history = [held('WM_WTStudy_Reader', C.WM_WTStudyReader)];
  assert.ok(result(history, { assignment: 'HC_MM_Dynamic', wholeWeek: true }));
  assert.equal(
    result(history, { assignment: 'HC_Yearly_Dynamic', wholeWeek: true }),
    undefined
  );
});

test('duplicate history does not double the workload; another view stays unavailable for a duty', () => {
  const part = held('MM_TGWTalk', C.MM_TGWTalk);
  assert.equal(result([part, part])?.penalty, result([part])?.penalty);
  assert.equal(
    result([held('MM_TGWTalk', C.MM_TGWTalk, { dataView: 'other' })])?.blocked,
    true
  );
});

test('chairman and auxiliary counselor cannot also cover the microphones', () => {
  assert.equal(result([held('MM_Chairman_A', C.MM_Chairman)])?.blocked, true);
  assert.equal(
    result([held('MM_Chairman_B', C.MM_AuxiliaryCounselor)])?.blocked,
    true
  );
});

test('meeting part labels show compact source durations, including fixed Bible reading', () => {
  const conflict = result(
    [
      held('MM_TGWBibleReading_A', C.MM_BibleReading, {
        title: 'Bible reading',
      }),
      held('MM_LCPart1', C.MM_LCPart, { title: 'Living as Christians' }),
    ],
    { minutes: { lc_part1: 13 } }
  )!;
  assert.equal(
    formatAssignmentConflict(conflict, (time) => `(${time} min)`),
    'Bible reading (4 min) · Living as Christians (13 min)'
  );
});

test('labels never display workload estimates as durations or add an overlap prefix', () => {
  const conflict = result([
    held('MM_Chairman_A', C.MM_Chairman, { title: 'Chairman' }),
    held('MM_DUTIES_Audio_1', C.DUTIES_Audio, { title: 'Audio' }),
    held('MM_AYFPart1_Student_A', C.MM_Talk, { title: 'Talk' }),
  ])!;
  assert.equal(
    formatAssignmentConflict(conflict, (time) => `(${time} min)`),
    'Chairman · Audio · Talk'
  );
});

test('the same assignment is listed once and uses its current source duration', () => {
  const part = held('MM_AYFPart1_Student_A', C.MM_Talk, { title: 'Talk' });
  const conflict = result([part, part], { minutes: { ayf_part1: 5 } })!;
  assert.equal(
    formatAssignmentConflict(conflict, (time) => `(${time} min)`),
    'Talk (5 min)'
  );
});

test('Weekend pickers use the same free, meeting-part and duty groups', () => {
  const weekend = { assignment: 'WM_DUTIES_Microphone_1' };
  const prayer = result([held('WM_OpeningPrayer', C.WM_Prayer)], weekend);
  const study = result(
    [held('WM_WTStudy_Reader', C.WM_WTStudyReader)],
    weekend
  );
  const audio = result([held('WM_DUTIES_Audio_1', C.DUTIES_Audio)], weekend);
  assert.equal(assignmentConflictGroup(prayer), 1);
  assert.equal(assignmentConflictGroup(study), 1);
  assert.equal(assignmentConflictGroup(audio), 2);
  assert.equal(prayer?.blocked, false);
  assert.equal(study?.blocked, true);
  assert.equal(audio?.blocked, true);
  assert.ok(prayer!.penalty < study!.penalty);
});

test('Weekend microphone shifts permit a study reader only outside the study', () => {
  const shift = {
    assignment: 'WM_DUTIES_Dynamic',
    scheduleId: 'talk_1',
    sections: {
      midweek: [],
      weekend: [
        section('talk', ['public_talk']),
        section('study', ['w_study']),
      ],
    },
  };
  const reader = held('WM_WTStudy_Reader', C.WM_WTStudyReader);
  assert.equal(result([reader], shift)?.blocked, false);
  assert.equal(
    result([reader], { ...shift, scheduleId: 'study_1' })?.blocked,
    true
  );
  assert.equal(
    result(
      [
        held('WM_DUTIES_Dynamic', C.DUTIES_Microphone, {
          schedule_id: 'study_1',
        }),
      ],
      shift
    )?.blocked,
    false
  );
  assert.equal(
    result(
      [
        held('WM_DUTIES_Dynamic', C.DUTIES_Microphone, {
          schedule_id: 'talk_2',
        }),
      ],
      shift
    )?.blocked,
    true
  );
});

test('Weekend continuous duties protect coverage during a public talk', () => {
  const speaker = held('WM_Speaker_Part1', C.WM_Speaker);
  assert.equal(
    result([speaker], { assignment: 'WM_DUTIES_Audio_1', code: C.DUTIES_Audio })
      ?.blocked,
    true
  );
  assert.equal(
    result([speaker], { assignment: 'WM_DUTIES_Microphone_1' })?.blocked,
    false
  );
});

test('each meeting ignores assignments in the other meeting', () => {
  assert.equal(
    result([held('MM_TGWGems', C.MM_TGWGems)], {
      assignment: 'WM_DUTIES_Microphone_1',
    }),
    undefined
  );
  assert.equal(
    result([held('WM_WTStudy_Conductor', C.WM_WTStudyConductor)]),
    undefined
  );
});

test('Midweek compatible short parts rank by current source duration', () => {
  const minutes = { ayf_part1: 3, tgw_talk: 10 };
  const demonstration = result(
    [held('MM_AYFPart1_Student_A', C.MM_StartingConversation)],
    { minutes }
  )!;
  const reading = result([held('MM_TGWBibleReading_A', C.MM_BibleReading)], {
    minutes,
  })!;
  const talk = result([held('MM_TGWTalk', C.MM_TGWTalk)], { minutes })!;
  assert.equal(demonstration.blocked, false);
  assert.ok(demonstration.penalty < reading.penalty);
  assert.ok(reading.penalty < talk.penalty);
});

test('Weekend labels do not claim estimated study, talk or prayer durations', () => {
  const conflict = result(
    [
      held('WM_OpeningPrayer', C.WM_Prayer, { title: 'Prayer' }),
      held('WM_Speaker_Part1', C.WM_Speaker, { title: 'Public talk' }),
      held('WM_WTStudy_Reader', C.WM_WTStudyReader, {
        title: 'Watchtower reader',
      }),
    ],
    { assignment: 'WM_DUTIES_Microphone_1' }
  )!;
  assert.equal(
    formatAssignmentConflict(conflict, (time) => `(${time} min)`),
    'Prayer · Public talk · Watchtower reader'
  );
});
