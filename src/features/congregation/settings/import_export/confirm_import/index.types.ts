import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { PersonType } from '@definition/person';
import { SchedWeekType } from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type ConfirmImportProps = {
  onBack: VoidFunction;
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
  | 'user_settings';

export type ImportChoiceType = Record<ImportFieldType, boolean>;

export type ImportDbType = {
  persons?: PersonType[];
  field_service_groups?: FieldServiceGroupType[];
  visiting_speakers?: VisitingSpeakerType[];
  speakers_congregations?: SpeakersCongregationsType[];
  user_field_service_reports?: UserFieldServiceReportType[];
  user_bible_studies?: UserBibleStudyType[];
  branch_cong_analysis?: BranchCongAnalysisType[];
  branch_field_service_reports?: BranchFieldServiceReportType[];
  cong_field_service_reports?: CongFieldServiceReportType[];
  meeting_attendance?: MeetingAttendanceType[];
  sources?: SourceWeekType[];
  sched?: SchedWeekType[];
  cong_settings?: SettingsType['cong_settings'];
  user_settings?: SettingsType['user_settings'];
};
