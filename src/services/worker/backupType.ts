import { OutgoingTalkExportScheduleType } from '@definition/schedules';

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
};
