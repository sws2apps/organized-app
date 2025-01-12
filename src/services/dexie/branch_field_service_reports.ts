import appDb from '@db/appDb';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';

const dbUpdateBranchFieldReportMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.branch_field_service_reports = {
    ...metadata.metadata.branch_field_service_reports,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbBranchFieldReportSave = async (
  report: BranchFieldServiceReportType
) => {
  await appDb.branch_field_service_reports.put(report);
  await dbUpdateBranchFieldReportMetadata();
};
