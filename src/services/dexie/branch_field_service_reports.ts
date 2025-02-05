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

export const dbBranchFieldReportClear = async () => {
  const records = await appDb.branch_field_service_reports.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.report_data._deleted = true;
    record.report_data.updatedAt = new Date().toISOString();
  }

  await appDb.branch_field_service_reports.bulkPut(records);
};
