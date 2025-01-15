import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import appDb from '@db/appDb';

const dbUpdateUserFieldServiceReportsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.user_field_service_reports = {
    ...metadata.metadata.user_field_service_reports,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbUserFieldServiceReportsGet = async () => {
  const data = await appDb.user_field_service_reports.toArray();
  return data;
};

export const dbUserFieldServiceReportsSave = async (
  report: UserFieldServiceReportType
) => {
  await appDb.user_field_service_reports.put(report);
  await dbUpdateUserFieldServiceReportsMetadata();
};
