import appDb from '@db/appDb';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';

export const dbBranchFieldReportSave = async (
  report: BranchFieldServiceReportType
) => {
  await appDb.branch_field_service_reports.put(report);
};
