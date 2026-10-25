import { FieldServiceMeetingCategory } from '@definition/field_service_meetings';
import type { FieldServiceGroupType } from '@definition/field_service_groups';
import type { SettingsType } from '@definition/settings';
import type { PersonType } from '@definition/person';
import { AssignmentCode } from '@definition/assignment';

export const fieldServiceMeetingPermissions = (
  settings: SettingsType,
  groups: FieldServiceGroupType[]
) => {
  const uid = settings.user_settings.user_local_uid;
  const isAdmin = settings.user_settings.cong_role.some((role) =>
    ['admin', 'secretary', 'coordinator'].includes(role)
  );
  const isServiceOverseer =
    settings.user_settings.cong_role.includes('service_overseer') ||
    (Boolean(uid) && uid === settings.cong_settings.responsabilities?.service);
  const canManageAll =
    isAdmin ||
    isServiceOverseer ||
    settings.user_settings.cong_role.includes('field_service_schedule');
  const activeGroups = groups.filter((group) => !group.group_data._deleted);
  const myMemberGroupIds = new Set(
    activeGroups
      .filter((group) =>
        group.group_data.members.some((member) => member.person_uid === uid)
      )
      .map((group) => group.group_id)
  );
  const myLedGroupIds = new Set(
    activeGroups
      .filter((group) =>
        group.group_data.members.some(
          (member) =>
            member.person_uid === uid &&
            (member.isOverseer || member.isAssistant)
        )
      )
      .map((group) => group.group_id)
  );
  const isAnyGroupLead = myLedGroupIds.size > 0;
  const canManageMeeting = (
    category: FieldServiceMeetingCategory,
    groupId?: string
  ) => {
    if (canManageAll) return true;
    if (!groupId || category !== FieldServiceMeetingCategory.RegularMeeting)
      return false;
    return myLedGroupIds.has(groupId);
  };
  return {
    isAdmin,
    canManageAll,
    isServiceOverseer,
    isAnyGroupLead,
    myLedGroupIds,
    myMemberGroupIds,
    canManageMeeting,
    canCreate: canManageAll || isAnyGroupLead,
    canEditGroupTimes: () => isAdmin,
  };
};

/** Restricted schedulers may select only qualified members of their own group. */
export const fieldServiceMeetingConductorAllowed = (
  conductor: string,
  groupId: string | undefined,
  groups: FieldServiceGroupType[],
  persons: PersonType[]
) => {
  const group = groups.find(
    (record) => record.group_id === groupId && !record.group_data._deleted
  );
  const person = persons.find(
    (record) =>
      record.person_uid === conductor &&
      !record._deleted.value &&
      !record.person_data.archived?.value
  );
  return Boolean(
    group?.group_data.members.some(
      (member) => member.person_uid === conductor
    ) &&
    person?.person_data.assignments?.some((assignment) =>
      assignment.values.includes(AssignmentCode.MINISTRY_FS_CONDUCTOR)
    )
  );
};
