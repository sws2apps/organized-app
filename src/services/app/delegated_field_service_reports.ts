import { debounce } from '@utils/common';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';

const handleSaveDelegatedFieldServiceReports = async (
  report: UserFieldServiceMonthlyReportType
) => {
  await dbDelegatedFieldServiceReportsSave(report);
};

export const debounceDelegatedFieldServiceSave = debounce(
  handleSaveDelegatedFieldServiceReports,
  500
);
