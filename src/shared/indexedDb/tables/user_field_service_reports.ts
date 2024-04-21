import { Table } from 'dexie';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export type UserFieldServiceReportsTable = {
  user_field_service_reports: Table<UserFieldServiceReportType>;
};

export const userFieldServiceReportsSchema = {
  user_field_service_reports:
    '&id, _deleted, month_date, duration, duration_start, hours_credits, bible_studies, bible_studies_record, comments, isSubmitted, record_type',
};
