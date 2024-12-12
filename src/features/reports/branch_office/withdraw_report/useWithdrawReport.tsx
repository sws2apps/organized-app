import { useRecoilValue } from 'recoil';
import { WithdrawReportProps } from './index.types';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { dbBranchFieldReportSave } from '@services/dexie/branch_field_service_reports';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { dbBranchCongAnalysisSave } from '@services/dexie/branch_cong_analysis';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { dbFieldServiceReportsBulkSave } from '@services/dexie/cong_field_service_reports';

const useWithdrawReport = ({ onClose }: WithdrawReportProps) => {
  const report = useRecoilValue(branchSelectedReportState);
  const month = useRecoilValue(branchSelectedMonthState);
  const year = useRecoilValue(branchSelectedYearState);
  const reports = useRecoilValue(branchFieldReportsState);
  const congAnalysis = useRecoilValue(branchCongAnalysisState);
  const congReports = useRecoilValue(congFieldServiceReportsState);

  const handleS1 = async () => {
    // mark all late reports submitted this month as pending
    const lateReports = congReports.filter(
      (record) =>
        record.report_data.status === 'confirmed' &&
        record.report_data.late.value &&
        record.report_data.late.submitted === month
    );

    const reportsToSave = lateReports.map((report) => {
      const obj = structuredClone(report);
      obj.report_data.late.submitted = '';

      return obj;
    });

    await dbFieldServiceReportsBulkSave(reportsToSave);

    // save status
    const currentReport = reports.find(
      (record) => record.report_date === month
    );

    const report = structuredClone(currentReport);
    report.report_data.submitted = false;
    report.report_data.updatedAt = new Date().toISOString();

    await dbBranchFieldReportSave(report);
  };

  const handleS10 = async () => {
    const currentAnalysis = congAnalysis.find(
      (record) => record.report_date === year
    );

    const analyis = structuredClone(currentAnalysis);
    analyis.report_data.submitted = false;
    analyis.report_data.updatedAt = new Date().toISOString();

    await dbBranchCongAnalysisSave(analyis);
  };

  const handleWithdraw = async () => {
    try {
      if (report === 'S-1') {
        await handleS1();
      }

      if (report === 'S-10') {
        await handleS10();
      }

      onClose?.();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleWithdraw };
};

export default useWithdrawReport;
