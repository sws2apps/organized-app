export type TimeAwayType = {
  id: string;
  startDate: string;
  endDate: string | null;
  comments: string;
};

export type TimeAwayRecordsType = {
  data: TimeAwayType[];
  changes: { date: string; id: string; type: 'add' | 'modify' | 'deleted'; value: TimeAwayType }[];
};

export type SettingsType = {
  id?: number;
  firstname?: { value: string; updatedAt: string };
  lastname?: { value: string; updatedAt: string };
  source_lang?: string;
  cong_number?: string;
  cong_name?: string;
  cong_code?: string;
  cong_new?: boolean;
  cong_role?: [];
  class_count?: number;
  midweek_meeting_day?: number;
  meeting_time?: Date;
  user_avatar?: Blob;
  co_name?: string;
  co_displayName?: string;
  autoBackup?: { value: boolean; updatedAt: string };
  autoBackup_interval?: { value: number; updatedAt: string };
  schedule_useFullname?: boolean;
  account_type?: string;
  opening_prayer_MM_autoAssign?: boolean;
  user_local_uid?: string;
  user_members_delegate?: [];
  opening_prayer_WM_autoAssign?: boolean;
  weekend_meeting_day?: number;
  midweek_meeting_useExactDate?: boolean;
  weekend_meeting_useSubstituteSpeaker?: boolean;
  follow_os_theme?: { value: boolean; updatedAt: string };
  enable_hour_credits?: { value: boolean; updatedAt: string };
  user_time_away?: TimeAwayRecordsType;
  public_talk_sync?: string;
};

export type BackupDataType = {
  dbPersons?: [];
  dbDeleted?: [];
  dbSourceMaterial?: [];
  dbSchedule?: object[];
  dbPublicTalks?: [];
  dbVisitingSpeakers?: [];
  dbBranchReportsTbl?: [];
  dbFieldServiceGroupTbl?: [];
  dbFieldServiceReportsTbl?: [];
  dbLateReportsTbl?: [];
  dbMeetingAttendanceTbl?: [];
  dbMinutesReportsTbl?: [];
  dbServiceYearTbl?: [];
  dbUserBibleStudiesTbl?: [];
  dbUserFieldServiceReportsTbl?: [];
  dbSettings?: object[];
};

export type ColorSchemeType = 'blue' | 'green' | 'purple' | 'orange';

export type SnackBarSeverityType = 'success' | 'error';

export type CustomClassName =
  | 'huge-numbers'
  | 'big-numbers'
  | 'label-small-medium'
  | 'label-small-regular'
  | 'h1'
  | 'h2'
  | 'h2-caps'
  | 'h3'
  | 'h4'
  | 'button-caps'
  | 'body-regular'
  | 'body-small-semibold'
  | 'body-small-regular';

export type AssignmentCheckListColors =
  | 'midweek-meeting'
  | 'treasures-from-gods-word'
  | 'apply-yourself-to-the-field-ministry'
  | 'living-as-christians'
  | 'weekend-meeting'
  | 'ministry'
  | 'duties';

export type BadgeColor = 'red' | 'grey' | 'green' | 'orange' | 'accent' | 'transparent';
