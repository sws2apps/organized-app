/*
This file holds the source of the truth from the table "settings".
Individual property are evaluated using recoil selector
*/

import { atom } from 'jotai';
import { settingSchema } from '@services/dexie/schema';
import { buildPersonFullname } from '@utils/common';
import { currentServiceYear } from '@utils/date';
import {
  FirstDayWeekOption,
  FullnameOption,
  PublishersSortOption,
  SourceFrequency,
} from '@definition/settings';
import { LANGUAGE_LIST } from '@constants/index';
import { AssignmentFieldType } from '@definition/assignment';

export const settingsState = atom(settingSchema);

// CONGREGATION SETTINGS
export const congNumberState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_number;
});

export const congNameState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_name;
});

export const congFullnameState = atom((get) => {
  const congName = get(congNameState);
  const congNumber = get(congNumberState);

  return `${congName}, ${congNumber}`;
});

export const circuitNumberState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  const circuit = settings.cong_settings.cong_circuit.find(
    (record) => record.type === dataView
  );

  return circuit?.value ?? '';
});

export const countryCodeState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.country_code;
});

export const congMasterKeyState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_master_key;
});

export const congAccessCodeState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_access_code;
});

export const congNewState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_new;
});

export const congRoleState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.cong_role;
});

export const fullnameOptionState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.fullname_option.find(
      (record) => record.type === dataView
    )?.value || FullnameOption.FIRST_BEFORE_LAST
  );
});

export const shortDateFormatState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.short_date_format.find(
      (record) => record.type === dataView
    )?.value || 'MM/dd/yyyy'
  );
});

export const hour24FormatState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    )?.value ?? true
  );
});

export const COFirstnameState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.circuit_overseer.firstname.value;
});

export const COLastnameState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.circuit_overseer.lastname.value;
});

export const CODisplayNameState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.circuit_overseer.display_name.value;
});

export const COFullnameState = atom((get) => {
  const firstname = get(COFirstnameState);
  const lastname = get(COLastnameState);
  const fullnameOption = get(fullnameOptionState);

  const fullname = buildPersonFullname(lastname, firstname, fullnameOption);

  return fullname;
});

export const COScheduleNameState = atom((get) => {
  const fullname = get(COFullnameState);
  const displayName = get(CODisplayNameState);
  const useDisplayName = get(displayNameMeetingsEnableState);

  const scheduleName = useDisplayName ? displayName : fullname;

  return scheduleName;
});

export const secretaryRoleState = atom((get) => {
  const congRole = get(congRoleState);
  return congRole.includes('secretary');
});

export const coordinatorRoleState = atom((get) => {
  const congRole = get(congRoleState);
  return congRole.includes('coordinator');
});

export const adminRoleState = atom((get) => {
  const congRole = get(congRoleState);
  const secretaryRole = get(secretaryRoleState);
  const coordinatorRole = get(coordinatorRoleState);

  return congRole.includes('admin') || coordinatorRole || secretaryRole;
});

export const pioneerRoleState = atom((get) => {
  const congRole = get(congRoleState);
  return congRole.some((role) => role.includes('pioneer'));
});

export const congDiscoverableState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_discoverable.value;
});

export const displayNameMeetingsEnableState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!Array.isArray(settings.cong_settings.display_name_enabled)) {
    return settings.cong_settings.display_name_enabled['meetings']['value'];
  }

  return (
    settings.cong_settings.display_name_enabled.find(
      (record) => record.type === dataView
    )?.meetings ?? false
  );
});

export const JWLangState = atom((get) => {
  const settings = get(settingsState);
  const sourceLanguages = get(sourceLanguagesState);
  const dataView = get(userDataViewState);

  if (!settings.cong_settings.source_material) return 'E';

  return (
    sourceLanguages.find((record) => record.type === dataView)?.value ?? 'E'
  );
});

export const JWLangLocaleState = atom((get) => {
  const JWLang = get(JWLangState);

  const locale =
    LANGUAGE_LIST.find((record) => record.code.toUpperCase() === JWLang)
      ?.threeLettersCode || 'eng';

  return locale;
});

export const sourcesJWAutoImportState = atom((get) => {
  const settings = get(settingsState);

  return (
    settings.cong_settings.source_material?.auto_import.enabled.value ?? true
  );
});

export const sourcesJWAutoImportFrequencyState = atom((get) => {
  const settings = get(settingsState);

  return (
    settings.cong_settings.source_material?.auto_import.frequency.value ||
    SourceFrequency.BIWEEKLY
  );
});

export const attendanceOnlineRecordState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!Array.isArray(settings.cong_settings.attendance_online_record)) {
    return settings.cong_settings.attendance_online_record['value'];
  }

  return (
    settings.cong_settings.attendance_online_record.find(
      (record) => record.type === dataView
    )?.value ?? false
  );
});

export const congAddressState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.cong_location.address;
});

export const congCountryState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.country_code;
});

export const congSpecialMonthsState = atom((get) => {
  const settings = get(settingsState);

  const result = settings.cong_settings.special_months.filter((record) => {
    if (record._deleted) return false;

    const currentYear = currentServiceYear();
    const previousYear = String(+currentYear - 1);

    return record.year >= previousYear;
  });

  return result.sort((a, b) => a.year.localeCompare(b.year));
});

export const congDataSyncState = atom((get) => {
  const settings = get(settingsState);

  return settings.cong_settings.data_sync.value;
});

export const languageGroupEnabledState = atom((get) => {
  const settings = get(settingsState);

  if (Array.isArray(settings.cong_settings.language_groups)) {
    return false;
  }

  return settings.cong_settings.language_groups.enabled.value;
});

export const sourceLanguagesState = atom((get) => {
  const settings = get(settingsState);

  if (!settings.cong_settings.source_material) {
    return [];
  }

  return settings.cong_settings.source_material.language.filter(
    (record) => !record._deleted
  );
});

// MIDWEEK MEETING

export const midweekMeetingClassCountState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return settings.cong_settings.midweek_meeting.find(
    (record) => record.type === dataView
  ).class_count.value;
});

export const midweekMeetingWeekdayState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.weekday.value ?? 2
  );
});

export const midweekMeetingTimeState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.time.value || '18:00'
  );
});

export const midweekMeetingOpeningPrayerLinkedState = atom<
  AssignmentFieldType | ''
>((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  const assignment =
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.opening_prayer_linked_assignment?.value || '';

  return assignment;
});

export const midweekMeetingClosingPrayerLinkedState = atom<
  AssignmentFieldType | ''
>((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  const assignment =
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.closing_prayer_linked_assignment?.value || '';

  return assignment;
});

export const meetingExactDateState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!Array.isArray(settings.cong_settings.schedule_exact_date_enabled)) {
    return settings.cong_settings.schedule_exact_date_enabled['value'];
  }

  return (
    settings.cong_settings.schedule_exact_date_enabled.find(
      (record) => record.type === dataView
    )?.value ?? false
  );
});

export const midweekMeetingAuxCounselorDefaultEnabledState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.aux_class_counselor_default.enabled.value ?? false
  );
});

export const midweekMeetingAuxCounselorDefaultState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.aux_class_counselor_default.person.value || ''
  );
});

export const midweekMeetingAssigFSGState = atom((get) => {
  const settings = get(settingsState);
  return settings.cong_settings.aux_class_fsg?.value ?? false;
});

// WEEKEND MEETING

export const weekendMeetingOpeningPrayerAutoAssignState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return settings.cong_settings.weekend_meeting.find(
    (record) => record.type === dataView
  ).opening_prayer_auto_assigned.value;
});

export const weekendMeetingWeekdayState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.weekday.value ?? 6
  );
});

export const weekendMeetingSubstituteSpeakerState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return settings.cong_settings.weekend_meeting.find(
    (record) => record.type === dataView
  ).substitute_speaker_enabled.value;
});

export const weekendMeetingWTSubstituteDisplayedState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.substitute_w_study_conductor_displayed.value ?? false
  );
});

export const weekendMeetingWTStudyConductorDefaultState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.w_study_conductor_default.value ?? ''
  );
});

export const weekendMeetingShowMonthlyWarningState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.consecutive_monthly_parts_notice_shown.value ?? false
  );
});

export const weekendMeetingTimeState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.time.value || '08:00'
  );
});

export const weekendSchedulesSongsWeekend = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings?.cong_settings?.schedule_songs_weekend?.find(
      (record) => record.type === dataView
    )?.value ?? false
  );
});

// USER SETTINGS

export const userDataViewState = atom((get) => {
  const settings = get(settingsState);
  const dataView = settings.user_settings.data_view;

  if (typeof dataView === 'string') {
    return dataView;
  }

  return settings.user_settings.data_view.value;
});

export const firstnameState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.firstname.value;
});

export const lastnameState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.lastname.value;
});

export const firstDayWeekState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  return (
    settings?.cong_settings?.first_day_week?.find(
      (record) => record.type === dataView
    )?.value ?? FirstDayWeekOption.MONDAY
  );
});

export const fullnameState = atom((get) => {
  const firstname = get(firstnameState);
  const lastname = get(lastnameState);
  const fullnameOption = get(fullnameOptionState);

  const fullname = buildPersonFullname(lastname, firstname, fullnameOption);

  return fullname;
});

export const userAvatarState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.user_avatar;
});

export const userAvatarUrlState = atom((get) => {
  const avatarBuffer = get(userAvatarState);

  let src = '';

  if (avatarBuffer) {
    const blob = new Blob([avatarBuffer]);
    src = URL.createObjectURL(blob);
  }

  return src;
});

export const backupAutoState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.backup_automatic.enabled.value;
});

export const backupIntervalState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.backup_automatic.interval.value;
});

export const accountTypeState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.account_type;
});

export const userLocalUIDState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.user_local_uid || '';
});

export const userMembersDelegateState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.user_members_delegate || [];
});

export const themeFollowOSEnabledState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.theme_follow_os_enabled.value;
});

export const hoursCreditsEnabledState = atom((get) => {
  const settings = get(settingsState);

  return settings.user_settings.hour_credits_enabled.value;
});

export const publishersSortState = atom((get) => {
  const settings = get(settingsState);

  return (
    settings.cong_settings.group_publishers_sort?.value ??
    PublishersSortOption.MANUAL
  );
});

export const isElderState = atom((get) => {
  const isAdmin = get(adminRoleState);
  const accountType = get(accountTypeState);
  const userRole = get(congRoleState);

  if (isAdmin) return true;

  if (accountType === 'pocket') return false;

  return userRole.includes('elder');
});

export const meetingDutiesState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!settings.cong_settings.meeting_duties) return;

  return settings.cong_settings.meeting_duties.find(
    (record) => record.type === dataView
  );
});

export const dutiesConflictPreventState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!settings.cong_settings.meeting_duties) return false;

  const duties = settings.cong_settings.meeting_duties.find(
    (record) => record.type === dataView
  );

  if (!duties) return false;

  return duties.conflict_prevent?.value ?? false;
});

export const dutiesMicrophoneSectionsState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!settings.cong_settings.meeting_duties) return false;

  const duties = settings.cong_settings.meeting_duties.find(
    (record) => record.type === dataView
  );

  if (!duties) return false;

  return duties.mic_sections?.value ?? false;
});

export const dutiesCustomState = atom((get) => {
  const settings = get(settingsState);
  const dataView = get(userDataViewState);

  if (!settings.cong_settings.meeting_duties) return [];

  const duties = settings.cong_settings.meeting_duties.find(
    (record) => record.type === dataView
  );

  if (!duties) return [];

  return duties.custom?.filter((record) => !record._deleted) ?? [];
});
