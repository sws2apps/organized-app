import type {
  FieldServiceMeetingType,
  FieldServiceMeetingSyncRecord,
  FieldServiceSchedulingScope,
  FieldServiceMeetingReceipt,
} from '@definition/field_service_meetings';
import type { FieldServiceGroupType } from '@definition/field_service_groups';
import type { PersonType } from '@definition/person';
import { encryptData, decryptData, decryptObject } from '@services/encryption';
import { fieldServiceMeetingConductorAllowed } from '@utils/field_service_meeting_permissions';

export const fieldServiceMeetingToSync = (
  meeting: FieldServiceMeetingType,
  accessCode: string
): FieldServiceMeetingSyncRecord => ({
  meeting_uid: meeting.meeting_uid,
  revision: meeting.sync_revision,
  authorization: {
    group_id: meeting.meeting_data.group_id,
    category: meeting.meeting_data.category,
    conductor: meeting.meeting_data.conductor,
    deleted: meeting.meeting_data._deleted,
    updatedAt: meeting.meeting_data.updatedAt,
  },
  meeting_data: encryptData(JSON.stringify(meeting.meeting_data), accessCode),
});

/** Never trust encrypted duplicates of the server-validated authorization fields. */
export const fieldServiceMeetingFromSync = (
  record: FieldServiceMeetingType | FieldServiceMeetingSyncRecord,
  accessCode: string
): FieldServiceMeetingType => {
  if ('authorization' in record) {
    const data = JSON.parse(
      decryptData(
        record.meeting_data,
        accessCode,
        'meeting_data',
        'field_service_meetings'
      )
    ) as FieldServiceMeetingType['meeting_data'];
    const authority = record.authorization;
    return {
      meeting_uid: record.meeting_uid,
      sync_revision: record.revision,
      sync_updatedAt: record.authorization.updatedAt,
      meeting_data: {
        ...data,
        group_id: authority.group_id,
        type: authority.group_id ?? 'main',
        category: authority.category,
        conductor: authority.conductor,
        _deleted: authority.deleted,
        updatedAt: authority.updatedAt,
      },
    };
  }
  const meeting = structuredClone(record);
  decryptObject({ data: meeting, table: 'field_service_meetings', accessCode });
  if (meeting.updatedAt && meeting.updatedAt > meeting.meeting_data.updatedAt) {
    meeting.meeting_data._deleted = meeting._deleted ?? false;
    meeting.meeting_data.updatedAt = meeting.updatedAt;
  }
  delete meeting._deleted;
  delete meeting.updatedAt;
  return meeting;
};

/** Derive the trusted scheduling projection from existing group responsibilities. */
export const fieldServiceSchedulingScope = (
  groups: FieldServiceGroupType[],
  persons: PersonType[],
  baseRevision: string
): FieldServiceSchedulingScope => ({
  base_revision: baseRevision,
  groups: groups
    .filter((group) => !group.group_data._deleted)
    .map((group) => ({
      group_id: group.group_id,
      manager_uids: group.group_data.members
        .filter((member) => member.isOverseer || member.isAssistant)
        .map((member) => member.person_uid),
      conductor_uids: group.group_data.members
        .filter((member) =>
          fieldServiceMeetingConductorAllowed(
            member.person_uid,
            group.group_id,
            groups,
            persons
          )
        )
        .map((member) => member.person_uid),
    })),
});

/** A remote revision may acknowledge our edit; it must not rebase a pending conflicting edit. */
export const mergeFieldServiceMeetingFromSync = (
  local: FieldServiceMeetingType,
  remote: FieldServiceMeetingType
) => {
  const pending = local.sync_updatedAt !== local.meeting_data.updatedAt;
  // Clean copies follow server revisions even when another device's clock is behind.
  if (!pending) return remote;
  // A download can acknowledge the exact edit submitted before its receipt arrived.
  const keys = Object.keys({
    ...local.meeting_data,
    ...remote.meeting_data,
  }).sort((left, right) => left.localeCompare(right));
  if (
    remote.meeting_data.updatedAt === local.meeting_data.updatedAt &&
    JSON.stringify(remote.meeting_data, keys) ===
      JSON.stringify(local.meeting_data, keys)
  )
    return remote;
  // Keep pending content and its base revision; the API decides conflicting writes.
  return structuredClone(local);
};

export const acknowledgeFieldServiceMeeting = (
  meeting: FieldServiceMeetingType,
  receipt: FieldServiceMeetingReceipt
): FieldServiceMeetingType => {
  if (
    meeting.meeting_uid !== receipt.meeting_uid ||
    meeting.sync_revision !== receipt.base_revision
  )
    return meeting;
  return {
    ...meeting,
    sync_revision: receipt.revision,
    sync_updatedAt: receipt.updatedAt,
  };
};

export const fieldServiceGroupRoles = (
  personUid: string,
  groups: FieldServiceGroupType[]
) => {
  const roles = groups
    .filter(
      (group) =>
        !group.group_data._deleted &&
        group.group_data.members.some(
          (member) =>
            member.person_uid === personUid &&
            (member.isOverseer || member.isAssistant)
        )
    )
    .map((group) =>
      group.group_data.language_group
        ? ('language_group_overseers' as const)
        : ('group_overseers' as const)
    );
  return [...new Set(roles)];
};
