import { Table } from 'dexie';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export type UserFieldServiceReportsTable = {
  user_field_service_reports: Table<UserFieldServiceReportType>;
};

export const userFieldServiceReportsSchema = {
  user_field_service_reports: '&report_date, report_data',
};
