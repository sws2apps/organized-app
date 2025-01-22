import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import appDb from '@db/appDb';

const dbUpdateDelegatedFieldServiceReportsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.delegated_field_service_reports = {
    ...metadata.metadata.delegated_field_service_reports,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbDelegatedFieldServiceReportsGet = async () => {
  const data = await appDb.delegated_field_service_reports.toArray();
  return data;
};

export const dbDelegatedFieldServiceReportsSave = async (
  report: DelegatedFieldServiceReportType
) => {
  await appDb.delegated_field_service_reports.put(report);
  await dbUpdateDelegatedFieldServiceReportsMetadata();
};
