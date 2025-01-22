import { Table } from 'dexie';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';

export type DelegatedFieldServiceReportsTable = {
  delegated_field_service_reports: Table<UserFieldServiceMonthlyReportType>;
};

export const delegatedFieldServiceReportsSchema = {
  delegated_field_service_reports: '&report_date, report_data',
};
