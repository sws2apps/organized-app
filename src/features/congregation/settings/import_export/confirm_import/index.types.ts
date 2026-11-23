export type { ImportDbType } from '@definition/backup';

export type ConfirmImportProps = {
  onBack: VoidFunction;
  onClose: VoidFunction;
};

export type ImportFieldType =
  | 'persons'
  | 'field_service_groups'
  | 'visiting_speakers'
  | 'user_field_service_reports'
  | 'cong_field_service_reports'
  | 'meeting_attendance'
  | 'midweek_history'
  | 'weekend_history'
  | 'cong_settings'
  | 'user_settings'
  | 'upcoming_events';

export type ImportChoiceType = Record<ImportFieldType, boolean>;
