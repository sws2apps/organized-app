import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { publisherCurrentReportState } from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useLockOverride = () => {
  const [currentReport, setCurrentReport] = useAtom(
    publisherCurrentReportState
  );

  const branchReports = useAtomValue(branchFieldReportsState);

  const branch_submitted = useMemo(() => {
    const report = branchReports.find(
      (record) => record.report_date === currentReport.report_data.report_date
    );

    if (!report) return false;

    return report.report_data.submitted;
  }, [branchReports, currentReport]);

  const checked = useMemo(() => {
    return currentReport.report_data.lock_override ?? false;
  }, [currentReport]);

  const show_override = useMemo(() => {
    if (currentReport.report_data.lock_override) return true;

    return branch_submitted;
  }, [currentReport, branch_submitted]);

  const handleChecked = async (value: boolean) => {
    const overrideReport = structuredClone(currentReport);
    overrideReport.report_data.lock_override = value;
    overrideReport.report_data.status = 'confirmed';
    overrideReport.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(overrideReport);
  };

  return {
    show_override,
    checked,
    handleChecked,
  };
};

export default useLockOverride;
