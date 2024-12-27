import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { publisherCurrentReportState } from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useComments = () => {
  const [currentReport, setCurrentReport] = useRecoilState(
    publisherCurrentReportState
  );

  const branchReports = useRecoilValue(branchFieldReportsState);

  const readOnly = useMemo(() => {
    const branchReport = branchReports.find(
      (record) => record.report_date === currentReport.report_data.report_date
    );

    if (!branchReport) return false;

    const isLate =
      currentReport?.report_data.late.value &&
      currentReport?.report_data.late.submitted.length === 0;

    if (isLate) return false;

    return branchReport.report_data.submitted;
  }, [branchReports, currentReport]);

  const value = useMemo(() => {
    return currentReport.report_data.comments;
  }, [currentReport]);

  const handleCommentsChange = async (value: string) => {
    const report = structuredClone(currentReport);

    report.report_data.comments = value;
    report.report_data.status = 'confirmed';
    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);
  };

  return { value, handleCommentsChange, readOnly };
};

export default useComments;
