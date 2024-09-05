import { useRecoilValue } from 'recoil';
import { SubmitReportProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
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

const useSubmitReport = ({ onClose }: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const report = useRecoilValue(branchSelectedReportState);
  const month = useRecoilValue(branchSelectedMonthState);
  const year = useRecoilValue(branchSelectedYearState);
  const reports = useRecoilValue(branchFieldReportsState);
  const congAnalysis = useRecoilValue(branchCongAnalysisState);
  const congReports = useRecoilValue(congFieldServiceReportsState);

  const handleS1 = async () => {
    // mark all late reports as submitted
    const lateReports = congReports.filter(
      (record) =>
        record.report_data.status === 'confirmed' &&
        record.report_data.late &&
        record.report_data.late.submitted.length === 0
    );

    const reportsToSave = lateReports.map((report) => {
      const obj = structuredClone(report);
      obj.report_data.late.submitted = month;

      return obj;
    });

    await dbFieldServiceReportsBulkSave(reportsToSave);

    // save status
    const currentReport = reports.find(
      (record) => record.report_date === month
    );

    const report = structuredClone(currentReport);
    report.report_data.submitted = true;
    report.report_data.updatedAt = new Date().toISOString();

    await dbBranchFieldReportSave(report);
  };

  const handleS10 = async () => {
    const currentAnalysis = congAnalysis.find(
      (record) => record.report_date === year
    );

    const analyis = structuredClone(currentAnalysis);
    analyis.report_data.submitted = true;
    analyis.report_data.updatedAt = new Date().toISOString();

    await dbBranchCongAnalysisSave(analyis);
  };

  const handleSubmitted = async () => {
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
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleSubmitted };
};

export default useSubmitReport;
