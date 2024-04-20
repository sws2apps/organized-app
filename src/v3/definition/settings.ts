import { TimeAwayType } from './person';

export type SettingsType = {
  id: number;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  source_lang: string;
  cong_number: string;
  cong_name: string;
  cong_code: string;
  cong_role: string[];
  cong_new: boolean;
  class_count: { value: number; updatedAt: string };
  midweek_meeting_day: { value: number; updatedAt: string };
  meeting_time: { value: string; updatedAt: string };
  user_avatar: ArrayBuffer;
  co_name: { value: string; updatedAt: string };
  co_displayName: { value: string; updatedAt: string };
  autoBackup: { value: boolean; updatedAt: string };
  autoBackup_interval: { value: number; updatedAt: string };
  schedule_useFullname: { value: boolean; updatedAt: string };
  account_type: string;
  opening_prayer_MM_autoAssign: { value: boolean; updatedAt: string };
  user_local_uid: string;
  user_members_delegate: [];
  opening_prayer_WM_autoAssign: { value: boolean; updatedAt: string };
  weekend_meeting_day: { value: number; updatedAt: string };
  midweek_meeting_useExactDate: { value: boolean; updatedAt: string };
  weekend_meeting_useSubstituteSpeaker: { value: boolean; updatedAt: string };
  follow_os_theme: { value: boolean; updatedAt: string };
  enable_hour_credits: { value: boolean; updatedAt: string };
  user_time_away: TimeAwayType[];
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
