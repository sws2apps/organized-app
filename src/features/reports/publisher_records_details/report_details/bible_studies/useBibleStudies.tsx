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
