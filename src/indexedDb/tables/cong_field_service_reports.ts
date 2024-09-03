import { Table } from 'dexie';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';

export type CongFieldServiceReportsTable = {
  cong_field_service_reports: Table<CongFieldServiceReportType>;
};

export const congFieldServiceReportsSchema = {
  cong_field_service_reports: '&report_id, report_data',
};
