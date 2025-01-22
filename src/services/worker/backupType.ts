import { AppRoleType } from '@definition/app';
import { OutgoingTalkExportScheduleType } from '@definition/schedules';

export type CongUserType = {
  id: string;
  local_uid: string;
  role: AppRoleType[];
};

export type BackupDataType = {
  last_backup?: string;
  cong_access_code?: string;
  cong_master_key?: string;
  speakers_key?: string;
  outgoing_talks?: OutgoingTalkExportScheduleType[];
  app_settings?: { user_settings: object; cong_settings?: object };
  persons?: object;
  speakers_congregations?: object;
  visiting_speakers?: object;
  outgoing_speakers?: object;
  user_bible_studies?: object;
  user_field_service_reports?: object;
  public_schedules?: object;
  public_sources?: object;
  incoming_reports?: object;
  field_service_groups?: object;
  cong_field_service_reports?: object;
  branch_cong_analysis?: object;
  branch_field_service_reports?: object;
  sched?: object;
  sources?: object;
  meeting_attendance?: object;
  cong_users?: CongUserType[];
  metadata?: Record<string, string>;
  delegated_field_service_reports?: object;
};
