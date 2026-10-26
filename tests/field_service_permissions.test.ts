import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  fieldServiceMeetingPermissions,
  fieldServiceMeetingConductorAllowed,
  fieldServiceMeetingUploadRecords,
} from '../src/utils/field_service_meeting_permissions';
import { FieldServiceMeetingCategory as Category } from '../src/definition/field_service_meetings';
import { AssignmentCode } from '../src/definition/assignment';
import type { SettingsType } from '../src/definition/settings';
import type { FieldServiceGroupType } from '../src/definition/field_service_groups';
import type { PersonType } from '../src/definition/person';
import type { AppRoleType } from '../src/definition/app';
const settings = (uid: string, roles: AppRoleType[] = []) =>
  ({
    user_settings: { user_local_uid: uid, cong_role: roles },
    cong_settings: { responsabilities: { service: 'service' } },
  }) as SettingsType;
const group = (
  id: string,
  uid: string,
  isOverseer = false,
  isAssistant = false,
  deleted = false
) =>
  ({
    group_id: id,
    group_data: {
      _deleted: deleted,
      members: [{ person_uid: uid, isOverseer, isAssistant }],
    },
  }) as FieldServiceGroupType;
const groups = [
  group('first', 'lead', true),
  group('second', 'assistant', false, true),
  group('third', 'member'),
];
for (const [name, config] of [
  ['admin', settings('a', ['admin'])],
  ['service role', settings('s', ['service_overseer'])],
  ['delegated scheduler', settings('delegate', ['field_service_schedule'])],
] as const) {
  test(`${name} can schedule all groups and joint meetings`, () => {
    const rights = fieldServiceMeetingPermissions(config, groups);
    assert.equal(rights.canCreate, true);
    assert.equal(rights.canManageAll, true);
    for (const category of [
      Category.RegularMeeting,
      Category.JointMeeting,
      Category.ServiceOverseerMeeting,
    ]) {
      assert.equal(rights.canManageMeeting(category), true);
      assert.equal(rights.canManageMeeting(category, 'first'), true);
      assert.equal(rights.canManageMeeting(category, 'third'), true);
    }
    assert.equal(
      rights.canEditGroupTimes(),
      config.user_settings.cong_role.includes('admin')
    );
  });
}
for (const [uid, own] of [
  ['lead', 'first'],
  ['assistant', 'second'],
]) {
  test(`${uid} can schedule only their own group`, () => {
    const rights = fieldServiceMeetingPermissions(
      settings(uid, ['group_overseers']),
      groups
    );
    assert.equal(rights.canCreate, true);
    assert.deepEqual([...rights.myLedGroupIds], [own]);
    assert.equal(rights.canManageMeeting(Category.RegularMeeting, own), true);
    assert.equal(
      rights.canManageMeeting(Category.RegularMeeting, 'third'),
      false
    );
    assert.equal(rights.canManageMeeting(Category.RegularMeeting), false);
    assert.equal(rights.canManageMeeting(Category.JointMeeting), false);
    assert.equal(rights.canManageMeeting(Category.JointMeeting, own), false);
    assert.equal(
      rights.canManageMeeting(Category.ServiceOverseerMeeting, own),
      false
    );
    assert.equal(rights.canEditGroupTimes(), false);
  });
}
test('membership alone and deleted groups do not grant scheduling', () => {
  assert.equal(
    fieldServiceMeetingPermissions(settings('member'), groups).canCreate,
    false
  );
  assert.equal(
    fieldServiceMeetingPermissions(settings('lead', ['group_overseers']), [
      group('first', 'lead', true, false, true),
    ]).canCreate,
    false
  );
});
test('revoking delegated rights restores group-only access', () => {
  assert.equal(
    fieldServiceMeetingPermissions(
      settings('lead', ['field_service_schedule']),
      groups
    ).canManageMeeting(Category.RegularMeeting, 'third'),
    true
  );
  assert.equal(
    fieldServiceMeetingPermissions(
      settings('lead', ['group_overseers']),
      groups
    ).canManageMeeting(Category.RegularMeeting, 'third'),
    false
  );
});
const person = (uid: string, qualified = true, deleted = false) =>
  ({
    person_uid: uid,
    _deleted: { value: deleted },
    person_data: {
      assignments: [
        { values: qualified ? [AssignmentCode.MINISTRY_FS_CONDUCTOR] : [] },
      ],
    },
  }) as PersonType;
test('conductor must be an active qualified member of the selected group', () => {
  const people = [person('lead'), person('assistant'), person('member', false)];
  assert.equal(
    fieldServiceMeetingConductorAllowed('lead', 'first', groups, people),
    true
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed('assistant', 'first', groups, people),
    false
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed('member', 'third', groups, people),
    false
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed(
      'Free text name',
      'first',
      groups,
      people
    ),
    false
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed('lead', undefined, groups, people),
    false
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed('lead', 'first', groups, [
      person('lead', true, true),
    ]),
    false
  );
  assert.equal(
    fieldServiceMeetingConductorAllowed(
      'lead',
      'first',
      [group('first', 'lead', true, false, true)],
      people
    ),
    false
  );
});

test('archived qualified conductors cannot pass the save-time group check', () => {
  const archived = person('lead');
  archived.person_data.archived = { value: true, updatedAt: '' };
  assert.equal(
    fieldServiceMeetingConductorAllowed('lead', 'first', groups, [archived]),
    false
  );
});

const uploadMeeting = (
  uid: string,
  groupId: string | undefined,
  category = Category.RegularMeeting,
  deleted = false
) =>
  ({
    meeting_uid: uid,
    meeting_data: { group_id: groupId, category, _deleted: deleted },
  }) as import('../src/definition/field_service_meetings').FieldServiceMeetingType;
const uploadRecords = [
  uploadMeeting('own', 'first'),
  uploadMeeting('other', 'third'),
  uploadMeeting('joint', undefined, Category.JointMeeting),
  uploadMeeting('visit', 'first', Category.ServiceOverseerMeeting),
  uploadMeeting('deleted-own', 'first', Category.RegularMeeting, true),
];
test('group overseer uploads exclude other groups, joint meetings and visits', () => {
  assert.deepEqual(
    fieldServiceMeetingUploadRecords(
      uploadRecords,
      settings('lead', ['group_overseers']),
      groups
    ).map((record) => record.meeting_uid),
    ['own', 'deleted-own']
  );
});
test('ordinary members cannot upload meeting changes', () => {
  assert.deepEqual(
    fieldServiceMeetingUploadRecords(uploadRecords, settings('member'), groups),
    []
  );
});
test('all-group schedulers may upload all meeting changes including tombstones', () => {
  assert.deepEqual(
    fieldServiceMeetingUploadRecords(
      uploadRecords,
      settings('delegate', ['field_service_schedule']),
      groups
    ),
    uploadRecords
  );
});

test('group assistants upload only their group’s regular meetings', () => {
  const records = [
    ...uploadRecords,
    uploadMeeting('assistant-group', 'second'),
  ];
  assert.deepEqual(
    fieldServiceMeetingUploadRecords(
      records,
      settings('assistant', ['group_overseers']),
      groups
    ).map((record) => record.meeting_uid),
    ['assistant-group']
  );
});

test('a local responsibility setting cannot grant congregation-wide editing', () => {
  assert.equal(
    fieldServiceMeetingPermissions(settings('service'), groups).canManageAll,
    false
  );
});

test('a group assignment without a current server-confirmed role does not grant editing', () => {
  assert.equal(
    fieldServiceMeetingPermissions(settings('lead', []), groups).canCreate,
    false
  );
});
