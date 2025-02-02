import { Table } from 'dexie';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';

export type DelegatedFieldServiceReportsTable = {
  delegated_field_service_reports: Table<DelegatedFieldServiceReportType>;
};

export const delegatedFieldServiceReportsSchema = {
  delegated_field_service_reports: '&report_id, report_data',
};
