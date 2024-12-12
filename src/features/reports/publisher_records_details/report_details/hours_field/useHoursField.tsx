import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { publisherCurrentReportState } from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useHoursField = () => {
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

  const hours = useMemo(() => {
    return currentReport.report_data.hours.field_service;
  }, [currentReport]);

  const handleHoursChange = (value: number) => {
    const report = structuredClone(currentReport);

    report.report_data.hours.field_service = value;
    report.report_data.shared_ministry = value > 0;
    report.report_data.status = 'confirmed';
    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);
  };

  return { hours, handleHoursChange, readOnly };
};

export default useHoursField;
