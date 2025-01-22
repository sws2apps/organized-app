import { debounce } from '@utils/common';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';

const handleSaveDelegatedFieldServiceReports = async (
  report: DelegatedFieldServiceReportType
) => {
  await dbDelegatedFieldServiceReportsSave(report);
};

export const debounceDelegatedFieldServiceSave = debounce(
  handleSaveDelegatedFieldServiceReports,
  500
);
