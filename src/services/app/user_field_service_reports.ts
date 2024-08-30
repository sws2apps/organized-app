import { debounce } from '@utils/common';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';

const handleSaveUserFieldServiceReports = async (
  report: UserFieldServiceMonthlyReportType
) => {
  await dbUserFieldServiceReportsSave(report);
};

export const debounceUserFieldServiceSave = debounce(
  handleSaveUserFieldServiceReports,
  500
);
