import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import appDb from '@db/appDb';

export const dbUserFieldServiceReportsSave = async (
  report: UserFieldServiceReportType
) => {
  await appDb.user_field_service_reports.put(report);
};
