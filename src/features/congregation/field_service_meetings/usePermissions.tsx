import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { settingsState, userLocalUIDState } from '@states/settings';
import { FieldServiceMeetingCategory } from '@definition/field_service_meetings';

/**
 * Centralised editing rights for the Field Service Meetings feature.
 *
 * - Everyone can view all meetings.
 * - A group overseer / assistant can create & edit their own group's meetings.
 * - The service overseer can create "Service overseer visit" meetings for any
 *   group, plus normal meetings in the group he belongs to.
 * - App admins can manage everything.
 * - Joint meetings can be managed by any group overseer / assistant.
 *
 * The same rules drive who can edit the per-group recurring meeting times.
 */
const useFieldServiceMeetingsPermissions = () => {
  const { isAdmin } = useCurrentUser();
  const userUID = useAtomValue(userLocalUIDState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const settings = useAtomValue(settingsState);

  const serviceOverseerUid =
    settings.cong_settings.responsabilities?.service ?? '';
  const isServiceOverseer = Boolean(userUID) && userUID === serviceOverseerUid;

  // Groups the user leads (overseer or assistant).
  const myLedGroupIds = useMemo(() => {
    const ids = new Set<string>();
    for (const group of groups) {
      const member = group.group_data.members.find(
        (m) => m.person_uid === userUID
      );
      if (member && (member.isOverseer || member.isAssistant)) {
        ids.add(group.group_id);
      }
    }
    return ids;
  }, [groups, userUID]);

  // Groups the user simply belongs to (used for the service overseer's
  // own-group normal-meeting rule).
  const myMemberGroupIds = useMemo(() => {
    const ids = new Set<string>();
    for (const group of groups) {
      if (group.group_data.members.some((m) => m.person_uid === userUID)) {
        ids.add(group.group_id);
      }
    }
    return ids;
  }, [groups, userUID]);

  const isAnyGroupLead = myLedGroupIds.size > 0;

  const canManageMeeting = useCallback(
    (category: FieldServiceMeetingCategory, groupId?: string) => {
      if (isAdmin) return true;

      if (category === FieldServiceMeetingCategory.JointMeeting) {
        return isAnyGroupLead;
      }

      if (category === FieldServiceMeetingCategory.ServiceOverseerMeeting) {
        if (isServiceOverseer) return true;
        return groupId ? myLedGroupIds.has(groupId) : isAnyGroupLead;
      }

      // Regular meeting.
      if (groupId) {
        if (myLedGroupIds.has(groupId)) return true;
        if (isServiceOverseer && myMemberGroupIds.has(groupId)) return true;
        return false;
      }

      return isAnyGroupLead;
    },
    [isAdmin, isAnyGroupLead, isServiceOverseer, myLedGroupIds, myMemberGroupIds]
  );

  const canEditGroupTimes = useCallback(
    (groupId: string) => isAdmin || myLedGroupIds.has(groupId),
    [isAdmin, myLedGroupIds]
  );

  const canCreate = isAdmin || isAnyGroupLead || isServiceOverseer;

  return {
    isAdmin,
    isServiceOverseer,
    isAnyGroupLead,
    myLedGroupIds,
    myMemberGroupIds,
    canManageMeeting,
    canEditGroupTimes,
    canCreate,
  };
};

export default useFieldServiceMeetingsPermissions;
