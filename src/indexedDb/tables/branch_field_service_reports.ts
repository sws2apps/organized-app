import { Table } from 'dexie';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';

export type BranchFieldServiceReportsTable = {
  branch_field_service_reports: Table<BranchFieldServiceReportType>;
};

export const branchFieldServiceReportsSchema = {
  branch_field_service_reports: '&report_date, report_data',
};
