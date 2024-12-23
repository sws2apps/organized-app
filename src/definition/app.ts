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

export type BadgeColor =
  | 'red'
  | 'grey'
  | 'green'
  | 'orange'
  | 'accent'
  | 'transparent';

export type MeetingType = 'midweek' | 'weekend';

export type AppRoleType =
  | 'admin'
  | 'coordinator'
  | 'secretary'
  | 'service_overseer'
  | 'midweek_schedule'
  | 'weekend_schedule'
  | 'public_talk_schedule'
  | 'attendance_tracking'
  | 'publisher'
  | 'view_schedules'
  | 'elder'
  | 'ms';

export type ReleaseNoteType = {
  [version: string]: {
    images: {
      [tag: string]: {
        src: string;
        tr_title: string;
        tr_desc: string;
      };
    };
    improvements: {
      [tag: string]: string;
    };
  };
};

export type UpdateStatusType = {
  [version: string]: boolean;
};

export type BackupFileType = 'CPE' | 'Organized' | '';
