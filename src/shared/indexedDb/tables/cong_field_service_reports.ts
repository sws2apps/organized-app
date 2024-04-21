import { Table } from 'dexie';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export type CongFieldServiceReportsTable = {
  cong_field_service_reports: Table<UserFieldServiceReportType>;
};

export const congFieldServiceReportsSchema = {
  cong_field_service_reports:
    '&id, _deleted, person_uid, month_date, duration, hours_credits, bible_studies, comments, posted_date',
};
