import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { publisherCurrentReportState } from '@states/field_service_reports';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useLateReport = () => {
  const { t } = useAppTranslation();

  const [currentReport, setCurrentReport] = useRecoilState(
    publisherCurrentReportState
  );

  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const branchReports = useRecoilValue(branchFieldReportsState);

  const branch_submitted = useMemo(() => {
    const report = branchReports.find(
      (record) => record.report_date === currentReport.report_data.report_date
    );

    if (!report) return false;

    return report.report_data.submitted;
  }, [branchReports, currentReport]);

  const readOnly = useMemo(() => {
    return currentReport.report_data.late.submitted.length > 0;
  }, [currentReport]);

  const checked = useMemo(() => {
    return currentReport.report_data.late.value;
  }, [currentReport]);

  const show_late = useMemo(() => {
    if (currentReport.report_data.late.value) return true;

    if (!branch_submitted) return true;

    return branch_submitted && !currentReport.report_data.shared_ministry;
  }, [currentReport, branch_submitted]);

  const late_sent = useMemo(() => {
    if (currentReport.report_data.late.submitted.length === 0) return '';

    const [year, month] = currentReport.report_data.late.submitted.split('/');
    const dateSent = new Date(+year, +month, 0);
    const sent = formatDate(dateSent, shortDateFormat);

    return t('tr_lateReportSent', { date: sent });
  }, [currentReport, t, shortDateFormat]);

  const handleChecked = async (value: boolean) => {
    const lateReport = structuredClone(currentReport);
    lateReport.report_data.late.value = value;
    lateReport.report_data.status = 'confirmed';
    lateReport.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(lateReport);
  };

  return {
    show_late,
    late_sent,
    checked,
    handleChecked,
    readOnly,
    branch_submitted,
  };
};

export default useLateReport;
