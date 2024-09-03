import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import appDb from '@db/appDb';

export const dbFieldServiceReportsSave = async (
  report: CongFieldServiceReportType
) => {
  await appDb.cong_field_service_reports.put(report);
};
