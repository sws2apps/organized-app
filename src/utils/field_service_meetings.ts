import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { SettingsType } from '@definition/settings';
import { formatDate, getWeekDate } from '@utils/date';

export const fieldServiceMeetingPermissions = (
  settings: SettingsType,
  groups: FieldServiceGroupType[]
) => {
  const uid = settings.user_settings.user_local_uid;
  const isAdmin = settings.user_settings.cong_role.some((role) =>
    ['admin', 'secretary', 'coordinator'].includes(role)
  );
  const isServiceOverseer =
    Boolean(uid) && uid === settings.cong_settings.responsabilities?.service;
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
    if (isAdmin) return true;
    if (category === FieldServiceMeetingCategory.JointMeeting)
      return isAnyGroupLead;
    if (
      category === FieldServiceMeetingCategory.ServiceOverseerMeeting &&
      isServiceOverseer
    )
      return true;
    if (!groupId) return isAnyGroupLead;
    return (
      myLedGroupIds.has(groupId) ||
      (isServiceOverseer &&
        category === FieldServiceMeetingCategory.RegularMeeting &&
        myMemberGroupIds.has(groupId))
    );
  };
  return {
    isAdmin,
    isServiceOverseer,
    isAnyGroupLead,
    myLedGroupIds,
    myMemberGroupIds,
    canManageMeeting,
    canCreate: isAdmin || isAnyGroupLead || isServiceOverseer,
    canEditGroupTimes: () => isAdmin,
  };
};

export const fieldServiceMeetingOverlapsRange = (
  meeting: FieldServiceMeetingType,
  rangeStart: string,
  rangeEnd: string
) => {
  const startDate = new Date(meeting.meeting_data.start);
  if (!Number.isFinite(startDate.getTime())) return false;
  const start = formatDate(startDate, 'yyyy/MM/dd');
  const endDate = new Date(meeting.meeting_data.end);
  const end =
    Number.isFinite(endDate.getTime()) && endDate >= startDate
      ? formatDate(endDate, 'yyyy/MM/dd')
      : start;
  return start <= rangeEnd && end >= rangeStart;
};

export const fieldServiceMeetingWeek = (date: Date) =>
  formatDate(getWeekDate(new Date(date)), 'yyyy/MM/dd');

export const fieldServiceMeetingDraftScope = (settings: SettingsType) => {
  const view = settings.user_settings.data_view;
  return `${settings.cong_settings.cong_id}:${settings.user_settings.user_local_uid}:${typeof view === 'string' ? view : view.value}`;
};
