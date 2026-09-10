import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  congFieldServiceReportsState,
  publisherCurrentReportState,
} from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { isCongReportLocked } from '@services/dexie/cong_field_service_reports';

const useBibleStudies = () => {
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

  const bible_studies = useMemo(() => {
    return currentReport.report_data.bible_studies;
  }, [currentReport]);

  const handleBibleStudyChange = (value: number) => {
    const report = structuredClone(currentReport);

    report.report_data.bible_studies = value;

    if (report.report_data.hours.field_service === 0) {
      report.report_data.shared_ministry = value > 0;
    }

    report.report_data.status = 'confirmed';
    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);
  };

  return { bible_studies, handleBibleStudyChange, readOnly };
};

export default useBibleStudies;
