import { updatedAtOverride } from '@utils/common';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import appDb from '@db/appDb';

const useCongReportsImport = () => {
  const getBranchCongAnalysis = async (reports: BranchCongAnalysisType[]) => {
    const result: BranchCongAnalysisType[] = [];

    result.push(...reports);

    const oldReports = await appDb.branch_cong_analysis.toArray();

    for (const oldReport of oldReports) {
      const newReport = reports.find(
        (record) => record.report_date === oldReport.report_date
      );

      if (!newReport) {
        oldReport.report_data._deleted = true;
        oldReport.report_data.updatedAt = new Date().toISOString();

        result.push(oldReport);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  const getBranchFieldReports = async (
    reports: BranchFieldServiceReportType[]
  ) => {
    const result: BranchFieldServiceReportType[] = [];

    result.push(...reports);

    const oldReports = await appDb.branch_field_service_reports.toArray();

    for (const oldReport of oldReports) {
      const newReport = reports.find(
        (record) => record.report_date === oldReport.report_date
      );

      if (!newReport) {
        oldReport.report_data._deleted = true;
        oldReport.report_data.updatedAt = new Date().toISOString();

        result.push(oldReport);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  const getCongFieldReports = async (reports: CongFieldServiceReportType[]) => {
    const result: CongFieldServiceReportType[] = [];

    result.push(...reports);

    const oldReports = await appDb.cong_field_service_reports.toArray();

    for (const oldReport of oldReports) {
      const newReport = reports.find(
        (record) => record.report_id === oldReport.report_id
      );

      if (!newReport) {
        oldReport.report_data._deleted = true;
        oldReport.report_data.updatedAt = new Date().toISOString();

        result.push(oldReport);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getBranchCongAnalysis, getBranchFieldReports, getCongFieldReports };
};

export default useCongReportsImport;
