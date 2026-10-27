import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { meetingDutiesDefault } from '@services/dexie/schema';
import { updateObject } from '@utils/common';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  sectionsForView,
  validateDutyName,
  uniqueDutyName,
} from '@utils/duties_sections';
import { filterScheduleByDataView } from '@utils/schedule_publish';
import {
  DutiesSectionType,
  AssignmentCongregation,
} from '@definition/schedules';

const section = (id = 'shift'): DutiesSectionType => ({
  id,
  name: 'First half',
  amount: 2,
  parts: ['tgw_gems'],
  dataView: 'main',
  _deleted: false,
  updatedAt: '2020-01-01',
});
const assignment = (type: string, value: string): AssignmentCongregation => ({
  id: 'shift_1',
  type,
  value,
  name: '',
  updatedAt: '2020-01-01',
});

test('scoped sections and assignments stay isolated in publishing', () => {
  const duties = {
    sections: [section(), { ...section('group-shift'), dataView: 'group' }],
    dynamic: [
      assignment('main', 'A'),
      { ...assignment('group', 'B'), id: 'group-shift_1' },
    ],
  };
  const result = filterScheduleByDataView(duties, 'group');
  assert.deepEqual(
    result.sections.map((item) => item.id),
    ['group-shift']
  );
  assert.deepEqual(
    result.dynamic.map((item) => item.value),
    ['B']
  );
  assert.deepEqual(result.sections[0].parts, ['tgw_gems']);
});

test('reordered sections respect the view and exclude deleted records', () => {
  const sections = [
    { ...section('a'), dataView: 'group', order: 1 },
    { ...section('b'), dataView: 'group', order: 0 },
    { ...section('c'), dataView: 'main' },
    { ...section('d'), dataView: 'group', _deleted: true },
  ];
  assert.deepEqual(
    sectionsForView(sections, 'group').map((item) => item.id),
    ['b', 'a']
  );
});

test('name validation handles whitespace, case, edits, deleted names and length', () => {
  const sections = [section()];
  assert.equal(validateDutyName('  ', sections), 'tr_fillRequiredField');
  assert.equal(
    validateDutyName(' FIRST HALF ', sections),
    'tr_sectionNameTaken'
  );
  assert.equal(validateDutyName('First half', sections, 'shift'), undefined);
  assert.equal(
    validateDutyName('First half', [{ ...section(), _deleted: true }]),
    undefined
  );
  assert.equal(
    validateDutyName('x'.repeat(41), sections),
    'tr_dutyNameTooLong'
  );
});

test('copied names remain bounded and unique even with a long translated title', () => {
  const base = 'Long title '.repeat(10);
  const first = uniqueDutyName(base, []);
  const second = uniqueDutyName(base, [{ id: 'a', name: first }]);
  assert.ok(first.length <= 40 && second.length <= 40);
  assert.notEqual(first, second);
});

test('generated duty defaults never replace configured values during sync', () => {
  const generated = meetingDutiesDefault('main');
  const configured = meetingDutiesDefault('main');
  configured.audio_amount = { value: 3, updatedAt: '2026-10-25T12:00:00Z' };
  configured.mic_sections = { value: true, updatedAt: '2026-10-25T12:00:00Z' };
  for (const [local, remote] of [
    [generated, configured],
    [configured, generated],
  ]) {
    const result = updateObject(
      { meeting_duties: [structuredClone(local)] },
      { meeting_duties: [structuredClone(remote)] }
    ).meeting_duties[0];
    assert.equal(result.audio_amount.value, 3);
    assert.equal(result.mic_sections.value, true);
  }
});

test('default settings belong to independent language groups and have no edit timestamps', () => {
  const main = meetingDutiesDefault('main');
  const group = meetingDutiesDefault('group');
  main.audio_amount.value = 4;
  main.custom.push({
    id: 'custom',
    name: 'Duty',
    amount: 1,
    _deleted: false,
    updatedAt: 'now',
  });
  assert.equal(group.type, 'group');
  assert.equal(group.audio_amount.value, 1);
  assert.deepEqual(group.custom, []);
  for (const field of Object.values(group)) {
    if (field && typeof field === 'object' && 'updatedAt' in field)
      assert.equal(field.updatedAt, '');
  }
});

test('duties editing requires membership in the selected language group', () => {
  const source = readFileSync(
    new URL('../src/hooks/useCurrentUser.tsx', import.meta.url),
    'utf8'
  );
  // Execute the actual hook with deterministic atom values, without mounting UI.
  const hook = source
    .slice(source.indexOf('const useCurrentUser ='))
    .replace('export default useCurrentUser;', '')
    .replace('import.meta.env.DEV', 'false');
  const code = ts.transpileModule(`${hook}; result = useCurrentUser();`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const member = { person_uid: 'user' };
  const groups = [
    { group_id: 'a', group_data: { members: [member] } },
    { group_id: 'b', group_data: { members: [] } },
  ];
  const canEdit = (role: string, view: string, enabled = true) => {
    const state = {
      userLocalUIDState: 'user',
      personsState: [],
      settingsState: { user_settings: { cong_role: [role] } },
      congAccountConnectedState: false,
      accountTypeState: 'vip',
      fieldWithLanguageGroupsState: [],
      languageGroupsState: groups,
      userDataViewState: view,
      featureFlagsState: { MEETING_DUTIES: enabled },
    };
    const context = {
      ...Object.fromEntries(Object.keys(state).map((key) => [key, key])),
      useAtomValue: (key: keyof typeof state) => state[key],
      useMemo: (calculate: () => unknown) => calculate(),
      usePerson: () => ({}),
      APP_ENVIRONMENT: 'PRODUCTION',
      MEETING_DUTIES_FLAG: 'MEETING_DUTIES',
      result: undefined as { isDutiesEditor: boolean } | undefined,
    };
    runInNewContext(code, context);
    return context.result?.isDutiesEditor;
  };
  for (const role of ['duties_schedule', 'language_group_overseers']) {
    assert.equal(canEdit(role, 'a'), true);
    assert.equal(canEdit(role, 'b'), false);
    assert.equal(canEdit(role, 'a', false), false);
  }
  assert.equal(canEdit('duties_schedule', 'main'), true);
  assert.equal(canEdit('language_group_overseers', 'main'), false);
  assert.equal(canEdit('publisher', 'a'), false);
  assert.equal(canEdit('admin', 'b'), true);
  assert.equal(canEdit('admin', 'b', false), false);
});
