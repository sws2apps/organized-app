/*
This file holds the source of the truth from the table "settings".
Individual property are evaluated using recoil selector
*/

import { atom, selector } from 'recoil';
import { settingSchema } from '@services/dexie/schema';
import { buildPersonFullname } from '@utils/common';

export const settingsState = atom({
  key: 'settings',
  default: settingSchema,
});

// CONGREGATION SETTINGS
export const congNumberState = selector({
  key: 'congNumber',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_number;
  },
});

export const congNameState = selector({
  key: 'congName',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_name;
  },
});

export const countryCodeState = selector({
  key: 'countryCode',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.country_code;
  },
});

export const congMasterKeyState = selector({
  key: 'congMasterKey',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_master_key;
  },
});

export const congAccessCodeState = selector({
  key: 'congAccessCode',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_access_code;
  },
});

export const congNewState = selector({
  key: 'congNew',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_new;
  },
});

export const congRoleState = selector({
  key: 'congRole',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.cong_role;
  },
});

export const fullnameOptionState = selector({
  key: 'fullnameOption',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.fullname_option.value;
  },
});

export const COFirstnameState = selector({
  key: 'coDisplayName',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.circuit_overseer.firstname.value;
  },
});

export const COLastnameState = selector({
  key: 'COLastname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.circuit_overseer.lastname.value;
  },
});

export const CODisplayNameState = selector({
  key: 'COLastnameState',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.circuit_overseer.display_name.value;
  },
});

export const COFullnameState = selector({
  key: 'COLFullname',
  get: ({ get }) => {
    const firstname = get(COFirstnameState);
    const lastname = get(COLastnameState);
    const fullnameOption = get(fullnameOptionState);

    const fullname = buildPersonFullname(lastname, firstname, fullnameOption);

    return fullname;
  },
});

export const COScheduleNameState = selector({
  key: 'COScheduleName',
  get: ({ get }) => {
    const fullname = get(COFullnameState);
    const displayName = get(CODisplayNameState);
    const useDisplayName = get(displayNameEnableState);

    const scheduleName = useDisplayName ? displayName : fullname;

    return scheduleName;
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

    return (
      elderRole ||
      secretaryRole ||
      lmmoRole ||
      coordinatorRole ||
      publicTalkCoordinatorRole
    );
  },
});

export const personEditorRoleState = selector({
  key: 'personEditorRole',
  get: ({ get }) => {
    const secretaryRole = get(secretaryRoleState);
    const lmmoRole = get(lmmoRoleState);
    const coordinatorRole = get(coordinatorRoleState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);

    return (
      secretaryRole || lmmoRole || coordinatorRole || publicTalkCoordinatorRole
    );
  },
});

export const meetingEditorRoleState = selector({
  key: 'meetingEditorRole',
  get: ({ get }) => {
    const lmmoRole = get(lmmoRoleState);
    const coordinatorRole = get(coordinatorRoleState);
    const publicTalkCoordinatorRole = get(publicTalkCoordinatorRoleState);

    return lmmoRole || coordinatorRole || publicTalkCoordinatorRole;
  },
});

export const congDiscoverableState = selector({
  key: 'congDiscoverable',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.cong_discoverable.value;
  },
});

export const displayNameEnableState = selector({
  key: 'displayNameEnable',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.cong_settings.display_name_enabled.value;
  },
});

// MIDWEEK MEETING

export const midweekMeetingClassCountState = selector({
  key: 'midweekMeetingClassCount',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    ).class_count.value;
  },
});

export const midweekMeetingWeekdayState = selector({
  key: 'midweekMeetingWeekday',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    ).weekday;
  },
});

export const midweekMeetingTimeState = selector({
  key: 'midweekMeetingTime',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    ).time;
  },
});

export const midweekMeetingOpeningPrayerAutoAssign = selector({
  key: 'openingPrayerMMAutoAssign',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    ).opening_prayer_auto_assign.value;
  },
});

export const midweekMeetingExactDateState = selector({
  key: 'midweekMeetingExactDate',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    ).schedule_exact_date_enabled.value;
  },
});

// WEEKEND MEETING

export const weekendMeetingOpeningPrayerAutoAssignState = selector({
  key: 'weekendMeetingOpeningPrayerAutoAssign',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    ).opening_prayer_auto_assigned.value;
  },
});

export const weekendMeetingWeekdayState = selector({
  key: 'weekendMeetingWeekday',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    ).weekday;
  },
});

export const weekendMeetingSubstituteSpeakerState = selector({
  key: 'weekendMeetingSubstituteSpeaker',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    ).substitute_speaker_enabled;
  },
});

export const weekendMeetingWTStudyConductorDefaultState = selector({
  key: 'weekendMeetingWTStudyConductorDefault',
  get: ({ get }) => {
    const settings = get(settingsState);
    const dataView = get(userDataViewState);

    return (
      settings.cong_settings.weekend_meeting.find(
        (record) => record.type === dataView
      )?.w_study_conductor_default.value || ''
    );
  },
});

// USER SETTINGS

export const userDataViewState = selector({
  key: 'userDataView',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.data_view;
  },
});

export const firstnameState = selector({
  key: 'firstname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.firstname.value;
  },
});

export const lastnameState = selector({
  key: 'lastname',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.lastname.value;
  },
});

export const fullnameState = selector({
  key: 'fullname',
  get: ({ get }) => {
    const firstname = get(firstnameState);
    const lastname = get(lastnameState);
    const fullnameOption = get(fullnameOptionState);

    const fullname = buildPersonFullname(lastname, firstname, fullnameOption);

    return fullname;
  },
});

export const userAvatarState = selector({
  key: 'userAvatar',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.user_avatar;
  },
});

export const userAvatarUrlState = selector({
  key: 'userAvatarUrl',
  get: ({ get }) => {
    const avatarBuffer = get(userAvatarState);

    let src = '';

    if (avatarBuffer) {
      const blob = new Blob([avatarBuffer]);
      src = URL.createObjectURL(blob);
    }

    return src;
  },
});

export const backupAutoState = selector({
  key: 'backupAuto',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.backup_automatic.enabled.value;
  },
});

export const backupIntervalState = selector({
  key: 'backupInterval',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.backup_automatic.interval.value;
  },
});

export const accountTypeState = selector({
  key: 'accountType',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.account_type;
  },
});

export const userLocalUIDState = selector({
  key: 'userLocalUID',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.user_local_uid;
  },
});

export const userMembersDelegateState = selector({
  key: 'userMembersDelegate',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.user_members_delegate;
  },
});

export const themeFollowOSEnabledState = selector({
  key: 'themeFollowOSEnabled',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.theme_follow_os_enabled.value;
  },
});

export const hoursCreditsEnabledState = selector({
  key: 'hoursCreditsEnabled',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.hour_credits_enabled.value;
  },
});

export const userTimeAwayState = selector({
  key: 'userTimeAway',
  get: ({ get }) => {
    const settings = get(settingsState);

    return settings.user_settings.user_time_away;
  },
});
