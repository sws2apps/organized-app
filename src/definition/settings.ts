import { TimeAwayType } from './person';

export enum FullnameOption {
  FIRST_BEFORE_LAST = 1,
  LAST_BEFORE_FIRST = 2,
}

export type AccountTypeState = 'vip' | 'pocket';

export type SettingsType = {
  id: number;
  cong_settings: {
    country_code: string;
    cong_number: string;
    cong_name: string;
    cong_master_key: string;
    cong_access_code: string;
    cong_location: { address: string; lat: number; lng: number };
    cong_new: boolean;
    cong_circuit: { type: string; value: string }[];
    cong_discoverable: { value: boolean; updatedAt: string };
    fullname_option: { value: FullnameOption; updatedAt: string };
    display_name_enabled: { value: boolean; updatedAt: string };
    midweek_meeting: {
      type: string;
      weekday: number;
      time: string;
      class_count: { value: number; updatedAt: string };
      opening_prayer_auto_assign: { value: boolean; updatedAt: string };
      schedule_exact_date_enabled: { value: boolean; updatedAt: string };
    }[];
    weekend_meeting: {
      type: string;
      weekday: number;
      time: string;
      opening_prayer_auto_assigned: { value: boolean; updatedAt: string };
      substitute_speaker_enabled: { value: boolean; updatedAt: string };
      w_study_conductor_default: { value: string; updatedAt: string };
    }[];
    circuit_overseer: {
      firstname: { value: string; updatedAt: string };
      lastname: { value: string; updatedAt: string };
      display_name: { value: string; updatedAt: string };
    };
    language_groups: { id: string; name: string; language: string }[];
  };
  user_settings: {
    cong_role: string[];
    account_type: '' | AccountTypeState;
    user_avatar: ArrayBuffer;
    user_local_uid: string;
    user_members_delegate: [];
    firstname: { value: string; updatedAt: string };
    lastname: { value: string; updatedAt: string };
    backup_automatic: {
      enabled: { value: boolean; updatedAt: string };
      interval: { value: number; updatedAt: string };
    };
    theme_follow_os_enabled: { value: boolean; updatedAt: string };
    hour_credits_enabled: { value: boolean; updatedAt: string };
    user_time_away: TimeAwayType[];
    data_view: string;
  };
};

export type BackupDataType = {
  dbPersons: [];
  dbDeleted: [];
  dbSourceMaterial: [];
  dbSchedule: object[];
  dbPublicTalks: [];
  dbVisitingSpeakers: [];
  dbBranchReportsTbl: [];
  dbFieldServiceGroupTbl: [];
  dbFieldServiceReportsTbl: [];
  dbLateReportsTbl: [];
  dbMeetingAttendanceTbl: [];
  dbMinutesReportsTbl: [];
  dbServiceYearTbl: [];
  dbUserBibleStudiesTbl: [];
  dbUserFieldServiceReportsTbl: [];
  dbSettings: object[];
};
