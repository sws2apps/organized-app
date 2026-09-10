import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { publisherCurrentReportState } from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { isCongReportLocked } from '@services/dexie/cong_field_service_reports';

const useMinistryShared = () => {
  const [currentReport, setCurrentReport] = useAtom(
    publisherCurrentReportState
  );

  const branchReports = useAtomValue(branchFieldReportsState);

  const readOnly = useMemo(() => {
    const branchReport = branchReports.find(
      (record) => record.report_date === currentReport.report_data.report_date
    );

    return isCongReportLocked(
      currentReport,
      branchReport?.report_data.submitted
    );
  }, [branchReports, currentReport]);

  const checked = useMemo(() => {
    return currentReport.report_data.shared_ministry;
  }, [currentReport]);

  const handleCheckedChange = async (value: boolean) => {
    const report = structuredClone(currentReport);

    report.report_data.shared_ministry = value;
    report.report_data.status = 'confirmed';
    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);
  };

  return { checked, handleCheckedChange, readOnly };
};

export default useMinistryShared;
