import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import appDb from '@db/appDb';

export const dbUserFieldServiceReportsGet = async () => {
  const data = await appDb.user_field_service_reports.toArray();
  return data;
};

export const dbUserFieldServiceReportsSave = async (
  report: UserFieldServiceReportType
) => {
  await appDb.user_field_service_reports.put(report);
};
