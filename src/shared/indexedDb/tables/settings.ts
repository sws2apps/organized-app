import { Table } from 'dexie';
import { SettingsType } from '@definition/app';

export type SettingsTable = {
  app_settings: Table<SettingsType>;
};

export const settingsSchema = {
  app_settings:
    '++id, username, source_lang, cong_number, cong_name, cong_role, class_count, meeting_day, meeting_time, isScheduleConverted, isCongVerified, isAssignmentsConverted, isCongUpdated2, user_avatar, account_version, co_name, co_displayName, personAssignmentsConverted, autoBackup, autoBackup_interval, schedule_useFullname, account_type, opening_prayer_MM_autoAssign, user_local_uid, user_members_delegate, opening_prayer_WM_autoAssign, midweek_meeting_day, weekend_meeting_day, midweek_meeting_useExactDate, weekend_meeting_useSubstituteSpeaker, assignment_updated2024, user_firstname, user_lastname, cong_code, cong_new, follow_os_theme, enable_hour_credits, user_time_away, public_talk_sync',
};
