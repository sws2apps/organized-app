import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  fieldServiceMeetingToSync,
  fieldServiceMeetingFromSync,
  fieldServiceSchedulingScope,
  mergeFieldServiceMeetingFromSync,
  acknowledgeFieldServiceMeeting,
  fieldServiceGroupRoles,
} from '../src/utils/field_service_meeting_sync';
import { AssignmentCode } from '../src/definition/assignment';
import type { FieldServiceMeetingType } from '../src/definition/field_service_meetings';
import type { FieldServiceGroupType } from '../src/definition/field_service_groups';
import type { PersonType } from '../src/definition/person';

const meeting = (): FieldServiceMeetingType => ({
  meeting_uid: 'meeting',
  sync_revision: 'r1',
  sync_updatedAt: '2026-10-26T00:00:00.000Z',
  meeting_data: {
    _deleted: false,
    updatedAt: '2026-10-26T00:00:00.000Z',
    start: '2026-10-28T09:30:00Z',
    end: '2026-10-28T10:00:00Z',
    type: 'group',
    category: 0,
    conductor: 'conductor',
    location: 0,
    group_id: 'group',
    address: 'Private address',
    additionalInfo: 'Private note',
  },
});

test('the wire record encrypts meeting content without mutating local data', () => {
  const local = meeting();
  const before = structuredClone(local);
  const wire = fieldServiceMeetingToSync(local, 'test-key');
  assert.equal(typeof wire.meeting_data, 'string');
  assert.equal(JSON.stringify(wire).includes('Private'), false);
  assert.deepEqual(local, before);
  assert.deepEqual(fieldServiceMeetingFromSync(wire, 'test-key'), local);
});

test('server-validated group, category, conductor and deletion override encrypted duplicates', () => {
  const wire = fieldServiceMeetingToSync(meeting(), 'test-key');
  wire.authorization.group_id = 'authoritative-group';
  wire.authorization.conductor = 'authoritative-conductor';
  wire.authorization.category = 3;
  wire.authorization.deleted = true;
  const restored = fieldServiceMeetingFromSync(wire, 'test-key');
  assert.equal(restored.meeting_data.group_id, 'authoritative-group');
  assert.equal(restored.meeting_data.type, 'authoritative-group');
  assert.equal(restored.meeting_data.conductor, 'authoritative-conductor');
  assert.equal(restored.meeting_data.category, 3);
  assert.equal(restored.meeting_data._deleted, true);
});

test('scope derives both managers and only eligible active conductors from existing group data', () => {
  const groups = [
    {
      group_id: 'group',
      group_data: {
        _deleted: false,
        members: [
          { person_uid: 'lead', isOverseer: true },
          { person_uid: 'assistant', isAssistant: true },
          { person_uid: 'conductor' },
          { person_uid: 'unqualified' },
          { person_uid: 'archived' },
        ],
      },
    },
    { group_id: 'deleted', group_data: { _deleted: true } },
  ] as FieldServiceGroupType[];
  const persons = ['conductor', 'archived', 'unqualified'].map((id) => ({
    person_uid: id,
    _deleted: { value: false },
    person_data: {
      archived: { value: id === 'archived' },
      assignments: [
        {
          values:
            id === 'unqualified' ? [] : [AssignmentCode.MINISTRY_FS_CONDUCTOR],
        },
      ],
    },
  })) as PersonType[];
  const before = structuredClone(groups);
  assert.deepEqual(fieldServiceSchedulingScope(groups, persons, 'scope-1'), {
    base_revision: 'scope-1',
    groups: [
      {
        group_id: 'group',
        manager_uids: ['lead', 'assistant'],
        conductor_uids: ['conductor'],
      },
    ],
  });
  assert.deepEqual(groups, before);
});

test('same-time meetings remain separate and notes can be empty without affecting sync', () => {
  const first = meeting();
  const second = meeting();
  second.meeting_uid = 'second';
  second.meeting_data.additionalInfo = '';
  const restored = [first, second].map((row) =>
    fieldServiceMeetingFromSync(
      fieldServiceMeetingToSync(row, 'test-key'),
      'test-key'
    )
  );
  assert.deepEqual(
    restored.map((row) => row.meeting_uid),
    ['meeting', 'second']
  );
  assert.equal(restored[1].meeting_data.additionalInfo, '');
});

test('an acknowledged local edit receives its server revision', () => {
  const local = meeting();
  const remote = meeting();
  remote.sync_revision = 'r2';
  assert.equal(
    mergeFieldServiceMeetingFromSync(local, remote).sync_revision,
    'r2'
  );
});

test('a pending offline edit retains its original revision when remote changed', () => {
  const local = meeting();
  local.meeting_data.updatedAt = '2026-10-27T00:00:00.000Z';
  const remote = meeting();
  remote.sync_revision = 'r2';
  assert.equal(
    mergeFieldServiceMeetingFromSync(local, remote).sync_revision,
    'r1'
  );
});

test('upload receipts advance the base while preserving a new edit made during upload', () => {
  const local = meeting();
  local.meeting_data.additionalInfo = 'Edited during upload';
  local.meeting_data.updatedAt = '2026-10-27T00:00:00.000Z';
  const updated = acknowledgeFieldServiceMeeting(local, {
    meeting_uid: local.meeting_uid,
    base_revision: 'r1',
    revision: 'r2',
    updatedAt: '2026-10-26T00:00:00.000Z',
  });
  assert.equal(updated.sync_revision, 'r2');
  assert.equal(updated.sync_updatedAt, '2026-10-26T00:00:00.000Z');
  assert.equal(updated.meeting_data.additionalInfo, 'Edited during upload');
  assert.notEqual(updated.sync_updatedAt, updated.meeting_data.updatedAt);
});

test('a delayed receipt cannot overwrite a revision downloaded from a newer sync', () => {
  const local = meeting();
  local.sync_revision = 'r3';
  assert.equal(
    acknowledgeFieldServiceMeeting(local, {
      meeting_uid: local.meeting_uid,
      base_revision: 'r1',
      revision: 'r2',
      updatedAt: local.meeting_data.updatedAt,
    }).sync_revision,
    'r3'
  );
});

test('manager roles consider every group rather than only the first membership', () => {
  const groups = [
    { group_id: 'first', group_data: { members: [{ person_uid: 'lead' }] } },
    {
      group_id: 'led',
      group_data: { members: [{ person_uid: 'lead', isAssistant: true }] },
    },
    {
      group_id: 'language',
      group_data: {
        language_group: true,
        members: [{ person_uid: 'lead', isOverseer: true }],
      },
    },
    {
      group_id: 'deleted',
      group_data: {
        _deleted: true,
        members: [{ person_uid: 'other', isOverseer: true }],
      },
    },
  ] as FieldServiceGroupType[];
  assert.deepEqual(fieldServiceGroupRoles('lead', groups), [
    'group_overseers',
    'language_group_overseers',
  ]);
  assert.deepEqual(fieldServiceGroupRoles('other', groups), []);
});
