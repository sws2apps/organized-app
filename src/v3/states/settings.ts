/*
This file holds the source of the truth from the table "settings".
Individual property are evaluated using recoil selector
*/

import { atom, selector } from 'recoil';
import { SettingsType } from '@definition/app';
import { AccountTypeState } from '@definition/api';

export const settingsState = atom({
  key: 'settings',
  default: {} as SettingsType,
});

export const firstnameState = selector({
  key: 'firstname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.firstname?.value || '';
  },
});

export const lastnameState = selector({
  key: 'lastname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.lastname?.value || '';
  },
});

export const fullnameState = selector({
  key: 'fullname',
  get: ({ get }) => {
    const firstname = get(firstnameState);
    const lastname = get(lastnameState);

    return `${lastname ? `${lastname} ` : ''}${firstname}`;
  },
});

export const congNumberState = selector({
  key: 'congNumber',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_number || '';
  },
});

export const congNameState = selector({
  key: 'congName',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_name || '';
  },
});

export const congEncryptionCodeState = selector({
  key: 'congEncryptionCode',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_code || '';
  },
});

export const congNewState = selector({
  key: 'congNew',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_new || false;
  },
});

export const congRoleState = selector({
  key: 'congRole',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_role || [];
  },
});

export const classCountState = selector({
  key: 'classCount',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.class_count || 1;
  },
});

export const midweekMeetingDayState = selector({
  key: 'midweekMeetingDay',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.midweek_meeting_day || 3;
  },
});

export const meetingTimeState = selector({
  key: 'meetingTime',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.meeting_time || new Date();
  },
});

export const userAvatarState = selector({
  key: 'userAvatar',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_avatar || undefined;
  },
});

export const coNameState = selector({
  key: 'coName',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.co_name || '';
  },
});

export const coDisplayNameState = selector({
  key: 'coDisplayName',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.co_displayName || '';
  },
});

export const autoBackupState = selector({
  key: 'autoBackup',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.autoBackup?.value || false;
  },
});

export const autoBackupIntervalState = selector({
  key: 'autoBackupInterval',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.autoBackup_interval?.value || 5;
  },
});

export const scheduleUseFullnameState = selector({
  key: 'scheduleUseFullname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.schedule_useFullname || false;
  },
});

export const accountTypeState = selector({
  key: 'accountType',
  get: ({ get }) => {
    const settings = get(settingsState);

    return (settings.account_type as AccountTypeState) || '';
  },
});

export const openingPrayerMMAutoAssignState = selector({
  key: 'openingPrayerMMAutoAssign',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.opening_prayer_MM_autoAssign || false;
  },
});

export const userLocalUIDState = selector({
  key: 'userLocalUID',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_local_uid || '';
  },
});

export const userMembersDelegateState = selector({
  key: 'userMembersDelegate',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_members_delegate || [];
  },
});

export const openingPrayerWMAutoAssignState = selector({
  key: 'openingPrayerWMAutoAssign',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.opening_prayer_WM_autoAssign || false;
  },
});

export const weekendMeetingDayState = selector({
  key: 'weekendMeetingDay',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.weekend_meeting_day || 6;
  },
});

export const adminRoleState = selector({
  key: 'adminRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('admin');
  },
});

export const lmmoRoleState = selector({
  key: 'lmmoRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('lmmo') || congRole.includes('lmmo-backup');
  },
});

export const secretaryRoleState = selector({
  key: 'secretaryRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('secretary');
  },
});

export const coordinatorRoleState = selector({
  key: 'coordinatorRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('coordinator');
  },
});

export const publicTalkCoordinatorRoleState = selector({
  key: 'publicTalkCoordinatorRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('public_talk_coordinator');
  },
});

export const elderRoleState = selector({
  key: 'elderRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('elder');
  },
});

export const msRoleState = selector({
  key: 'msRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    return congRole.includes('ms');
  },
});

export const publisherRoleState = selector({
  key: 'publisherRole',
  get: ({ get }) => {
    const congRole = get(congRoleState);
    const elderRole = get(elderRoleState);
    const msRole = get(msRoleState);

    return congRole.includes('publisher') || msRole || elderRole;
  },
});

export const elderLocalRoleState = selector({
  key: 'elderLocalRole',
  get: ({ get }) => {
    const elderRole = get(elderRoleState);
    const secretaryRole = get(secretaryRoleState);
    const lmmoRole = get(lmmoRoleState);
    const coordinatorRole = get(coordinatorRoleState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);

    return elderRole || secretaryRole || lmmoRole || coordinatorRole || publicTalkCoordinatorRole;
  },
});

export const personEditorRoleState = selector({
  key: 'personEditorRole',
  get: ({ get }) => {
    const secretaryRole = get(secretaryRoleState);
    const lmmoRole = get(lmmoRoleState);
    const coordinatorRole = get(coordinatorRoleState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);

    return secretaryRole || lmmoRole || coordinatorRole || publicTalkCoordinatorRole;
  },
});

export const isMeetingEditorRoleState = selector({
  key: 'isMeetingEditorRole',
  get: ({ get }) => {
    const lmmoRole = get(lmmoRoleState);
    const coordinatorRole = get(coordinatorRoleState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);

    return lmmoRole || coordinatorRole || publicTalkCoordinatorRole;
  },
});

export const avatarUrlState = selector({
  key: 'avatarUrl',
  get: ({ get }) => {
    const userAvatar = get(userAvatarState);

    let src = '';

    if (userAvatar && typeof userAvatar === 'object') {
      const blob = new Blob([userAvatar]);
      src = URL.createObjectURL(blob);
    }

    return src;
  },
});

export const autoAssignMMOpeningPrayerState = selector({
  key: 'autoAssignMMOpeningPrayer',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.opening_prayer_MM_autoAssign || false;
  },
});

export const autoAssignWMOpeningPrayerState = selector({
  key: 'autoAssignWMOpeningPrayer',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.opening_prayer_WM_autoAssign || false;
  },
});

export const midweekMeetingExactDateState = selector({
  key: 'midweekMeetingExactDate',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.midweek_meeting_useExactDate || false;
  },
});

export const weekendMeetingSubstituteSpeakerState = selector({
  key: 'weekendMeetingSubstituteSpeaker',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.weekend_meeting_useSubstituteSpeaker || false;
  },
});

export const followOSThemeState = selector({
  key: 'followOSTheme',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.follow_os_theme?.value || false;
  },
});

export const enableHourCreditsState = selector({
  key: 'enableHourCredits',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.enable_hour_credits?.value || false;
  },
});

export const userTimeAwayState = selector({
  key: 'userTimeAway',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings?.user_time_away || { data: [], changes: [] };
  },
});
