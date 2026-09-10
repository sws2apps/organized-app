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

    // Derive the lock from the persisted record, not the editing draft:
    // entering hours flips shared_ministry in the draft and must not lock
    // the remaining fields mid-session.
    const persistedReport = congReports.find(
      (record) =>
        record.report_data.report_date ===
          currentReport.report_data.report_date &&
        record.report_data.person_uid === currentReport.report_data.person_uid
    );

    return isCongReportLocked(
      persistedReport,
      branchReport?.report_data.submitted
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
