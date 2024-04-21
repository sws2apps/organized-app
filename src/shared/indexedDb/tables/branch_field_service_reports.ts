import { Table } from 'dexie';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';

export type BranchFieldServiceReportsTable = {
  branch_field_service_reports: Table<BranchFieldServiceReportType>;
};

export const branchFieldServiceReportsSchema = {
  branch_field_service_reports:
    '&id, updateAt, month_date, active_publishers, average_weekend_meeting, publishers, APs, FRs, isSubmitted',
};
