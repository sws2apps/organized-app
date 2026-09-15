import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  congFieldServiceReportsState,
  publisherCurrentReportState,
} from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { isCongReportLocked } from '@services/dexie/cong_field_service_reports';

const useHoursField = () => {
  const [currentReport, setCurrentReport] = useAtom(
    publisherCurrentReportState
  );

  const branchReports = useAtomValue(branchFieldReportsState);
  const congReports = useAtomValue(congFieldServiceReportsState);

  const readOnly = useMemo(() => {
    const branchReport = branchReports.find(
      (record) => record.report_date === currentReport.report_data.report_date
    );

    // Shared comes from the persisted record so entering hours does not lock
    // mid-session. Late comes from the draft so clearing late relocks at once.
    const persistedReport = congReports.find(
      (record) =>
        record.report_data.report_date ===
          currentReport.report_data.report_date &&
        record.report_data.person_uid === currentReport.report_data.person_uid
    );

    return isCongReportLocked(
      persistedReport,
      branchReport?.report_data.submitted,
      currentReport.report_data.late
    );
  }, [branchReports, congReports, currentReport]);

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
