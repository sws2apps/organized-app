import { debounce } from '@utils/common';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';

export const handleSaveFieldServiceReports = async (
  report: CongFieldServiceReportType
) => {
  await dbFieldServiceReportsSave(report);
};

export const debounceFieldServiceSave = debounce(
  handleSaveFieldServiceReports,
  500
);
