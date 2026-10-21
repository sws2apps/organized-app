import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AssignmentCode as C } from '../src/definition/assignment';
import type { AssignmentHistoryType } from '../src/definition/schedules';
import type { AssignmentConflictContext } from '../src/definition/assignment_conflicts';
import {
  collectAssignmentConflicts,
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
const conflicts = (
  history: AssignmentHistoryType[],
  extra: Partial<AssignmentConflictContext> = {}
) =>
  collectAssignmentConflicts({
    week: '2026/10/19',
    dataView: 'main',
    assignment: 'HC_MM_Dynamic',
    code: C.CLEANING_Hall,
    scheduleId: '2',
    history,
    minutes: {},
    ...extra,
  });

test('cleaning after a meeting counts its assignments as workload without blocking them', () => {
  const result = conflicts([held('MM_Chairman_A', C.MM_Chairman)]).get('one');
  assert.equal(result?.blocked, false);
  assert.ok(result!.penalty > 0);
});

test('a person cannot fill two positions in the same cleaning', () => {
  const result = conflicts([
    held('HC_MM_Dynamic', C.CLEANING_HallResponsible, { schedule_id: '1' }),
  ]).get('one');
  assert.equal(result?.blocked, true);
  assert.equal(
    conflicts([held('HC_MM_Dynamic', C.CLEANING_Hall, { schedule_id: '2' })])
      .size,
    0
  );
});

test('whole-week cleaning includes both meetings while major cleaning stays independent', () => {
  const history = [held('WM_Chairman', C.WM_Chairman)];
  assert.equal(conflicts(history).size, 0);
  assert.equal(conflicts(history, { wholeWeek: true }).size, 1);
  assert.equal(conflicts(history, { assignment: 'HC_Yearly_Dynamic' }).size, 0);
});

test('duplicate history does not inflate cleaning workload', () => {
  const entry = held('MM_TGWTalk', C.MM_TGWTalk);
  assert.equal(
    conflicts([entry, entry]).get('one')?.penalty,
    conflicts([entry]).get('one')?.penalty
  );
  assert.equal(conflicts([entry, entry]).get('one')?.details.length, 1);
});

test('conflict labels use source durations rather than workload estimates', () => {
  const result = conflicts([held('MM_TGWTalk', C.MM_TGWTalk)], {
    minutes: { tgw_talk: 12 },
  }).get('one')!;
  assert.equal(
    formatAssignmentConflict(result, (n) => `(${n} min)`),
    'MM_TGWTalk (12 min)'
  );
  const chairman = conflicts([held('MM_Chairman_A', C.MM_Chairman)]).get(
    'one'
  )!;
  assert.equal(chairman.details[0].minutes, undefined);
});

test('another week does not contribute to this cleaning workload', () => {
  const entry = {
    ...held('MM_Chairman_A', C.MM_Chairman),
    weekOf: '2026/10/12',
  };
  assert.equal(conflicts([entry]).size, 0);
});
