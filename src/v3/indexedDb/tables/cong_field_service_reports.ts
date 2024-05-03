import { Table } from 'dexie';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';

export type CongFieldServiceReportsTable = {
  cong_field_service_reports: Table<CongFieldServiceReportType>;
};

export const congFieldServiceReportsSchema = {
  cong_field_service_reports:
    '++id, _deleted, person_uid, month_date, shared_ministry, hours, hours_credits, bible_studies, comments, posted_date',
};
