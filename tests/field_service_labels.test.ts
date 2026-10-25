import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fieldServiceMeetingLabel } from '../src/utils/field_service_meeting_labels';
import { FieldServiceMeetingCategory as Category } from '../src/definition/field_service_meetings';

const labels: Record<string, string> = {
  tr_fieldServiceMeetingCategory_regular: 'Field service meeting',
  tr_fieldServiceMeetingCategory_joint: 'Joint meeting',
  tr_fieldServiceMeetingCategory_serviceOverseer: 'Service overseer visit',
  tr_group: 'Group',
  tr_allGroups: 'All groups',
};
const t = (key: string) => labels[key];
test('regular meeting labels preserve the group name', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      {
        category: Category.RegularMeeting,
        group_id: 'a',
        groupName: ' English Group ',
      },
      t
    ),
    'English Group'
  );
});
test('a visit retains both its group and additional category', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      {
        category: Category.ServiceOverseerMeeting,
        group_id: 'a',
        groupName: 'English Group',
      },
      t
    ),
    'English Group · Service overseer visit'
  );
});
test('a visit without a group explicitly includes all groups', () => {
  assert.equal(
    fieldServiceMeetingLabel({ category: Category.ServiceOverseerMeeting }, t),
    'All groups · Service overseer visit'
  );
});
test('a deleted group retains its scope instead of becoming all groups', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      { category: Category.ServiceOverseerMeeting, group_id: 'deleted' },
      t
    ),
    'Group · Service overseer visit'
  );
});
test('joint meetings use the translated joint label', () => {
  assert.equal(
    fieldServiceMeetingLabel({ category: Category.JointMeeting }, t),
    'Joint meeting'
  );
});
test('every part of the visit label uses the requested translator', () => {
  assert.equal(
    fieldServiceMeetingLabel(
      { category: Category.ServiceOverseerMeeting },
      (key) => `fr:${key}`
    ),
    'fr:tr_allGroups · fr:tr_fieldServiceMeetingCategory_serviceOverseer'
  );
});
