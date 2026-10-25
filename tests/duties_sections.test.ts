import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isolateLegacySections,
  resolveSectionSlot,
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

test('legacy layout and assignments become independent for every existing view', () => {
  const original = {
    sections: [section()],
    dynamic: [assignment('main', 'A'), assignment('group', 'B')],
  };
  const result = isolateLegacySections(original.sections, original.dynamic, [
    'main',
    'group',
    'empty-group',
  ]);
  assert.equal(result.sections.length, 3);
  for (const view of ['main', 'group', 'empty-group']) {
    const scoped = sectionsForView(result.sections, view);
    assert.equal(scoped.length, 1);
    assert.equal(scoped[0].dataView, view);
    if (view !== 'empty-group')
      assert.equal(
        result.dynamic.find((entry) => entry.type === view && entry.value)?.id,
        `${scoped[0].id}_1`
      );
  }
  sectionsForView(result.sections, 'group')[0].parts.push('lc_cbs');
  assert.deepEqual(sectionsForView(result.sections, 'main')[0].parts, [
    'tgw_gems',
  ]);
  assert.deepEqual(original.sections[0].parts, ['tgw_gems']);
  assert.equal(original.dynamic[1].id, 'shift_1');
});

test('isolation is idempotent and does not copy a private section to another view', () => {
  const first = isolateLegacySections(
    [section()],
    [assignment('group', 'B')],
    ['group']
  );
  assert.deepEqual(
    isolateLegacySections(first.sections, first.dynamic, [
      'group',
      'new-group',
    ]),
    first
  );
  assert.equal(sectionsForView(first.sections, 'new-group').length, 0);
});

test('a picker opened before isolation resolves to its own view only', () => {
  const { sections } = isolateLegacySections([section()], [], ['group']);
  assert.equal(
    resolveSectionSlot(sections, 'group', 'shift_1'),
    'shift~group_1'
  );
  assert.equal(resolveSectionSlot(sections, 'main', 'shift_1'), 'shift_1');
  assert.equal(resolveSectionSlot(sections, 'group', 'custom_1'), 'custom_1');
});

test('scoped sections and assignments stay isolated in publishing', () => {
  const duties = isolateLegacySections(
    [section()],
    [assignment('main', 'A'), assignment('group', 'B')],
    ['group']
  );
  const result = filterScheduleByDataView(duties, 'group');
  assert.deepEqual(
    result.sections.map((item) => item.dataView),
    ['group']
  );
  assert.deepEqual(
    result.dynamic.map((item) => item.value),
    ['', 'B']
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

test('legacy group slot IDs retain timestamped clears for already-published schedules', () => {
  const { dynamic } = isolateLegacySections(
    [section()],
    [assignment('group', 'B')],
    ['group']
  );
  const old = dynamic.find((entry) => entry.id === 'shift_1');
  const current = dynamic.find((entry) => entry.id === 'shift~group_1');
  assert.equal(old?.value, '');
  assert.equal(current?.value, 'B');
  assert.equal(old?.updatedAt, current?.updatedAt);
});
