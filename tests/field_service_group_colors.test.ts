import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { FieldServiceGroupType } from '../src/definition/field_service_groups';
import {
  getGroupBadgeColor,
  resolveGroupBadgeColor,
} from '../src/features/congregation/field_service_meetings/group_badge_color';

const group = (id: string, index: number, deleted = false) =>
  ({
    group_id: id,
    group_data: { sort_index: index, _deleted: deleted },
  }) as FieldServiceGroupType;

test('rail colors match the displayed group order, including sparse sort indexes', () => {
  const groups = [group('third', 8), group('first', 0), group('second', 4)];
  assert.equal(resolveGroupBadgeColor(groups, 'first'), 'group-1');
  assert.equal(resolveGroupBadgeColor(groups, 'second'), 'group-2');
  assert.equal(resolveGroupBadgeColor(groups, 'third'), 'group-3');
  assert.deepEqual(
    groups.map((record) => record.group_id),
    ['third', 'first', 'second']
  );
});
test('deleted groups do not consume a color slot', () => {
  assert.equal(
    resolveGroupBadgeColor(
      [group('deleted', 0, true), group('active', 1)],
      'active'
    ),
    'group-1'
  );
});
test('joint meetings and missing or deleted groups use the theme accent', () => {
  const groups = [group('deleted', 0, true)];
  assert.equal(resolveGroupBadgeColor(groups), 'accent-main');
  assert.equal(resolveGroupBadgeColor(groups, 'missing'), 'accent-main');
  assert.equal(resolveGroupBadgeColor(groups, 'deleted'), 'accent-main');
});
test('additional groups cycle through the existing palette', () => {
  assert.equal(getGroupBadgeColor(9), 'group-10');
  assert.equal(getGroupBadgeColor(10), 'group-1');
});
