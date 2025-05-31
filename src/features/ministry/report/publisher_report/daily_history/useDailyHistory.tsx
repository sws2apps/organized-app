import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
} from '@states/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useDailyHistory = () => {
  const setBibleStudyEditorOpen = useSetAtom(bibleStudyEditorOpenState);

  const userUID = useAtomValue(userLocalUIDState);
  const reportMonth = useAtomValue(reportUserSelectedMonthState);
  const reports = useAtomValue(userFieldServiceDailyReportsState);
  const congReports = useAtomValue(congFieldServiceReportsState);

  const { status } = useMinistryMonthlyRecord({
    month: reportMonth,
    person_uid: userUID,
    publisher: true,
  });

  const [editorOpen, setEditorOpen] = useState(false);

  const noCongReport = useMemo(() => {
    const findReport = congReports.find(
      (record) =>
        record.report_data.report_date === reportMonth &&
        record.report_data.person_uid === userUID
    );

    return findReport ? false : true;
  }, [congReports, reportMonth, userUID]);

  const dailyReports = useMemo(() => {
    if (!reportMonth || reportMonth.length === 0) return [];

    return reports
      .filter((record) => record.report_date.includes(reportMonth))
      .sort((a, b) => b.report_date.localeCompare(a.report_date));
  }, [reportMonth, reports]);

  const handleOpenEditor = () => setEditorOpen(true);

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setBibleStudyEditorOpen(false);
  };

  return {
    reportMonth,
    dailyReports,
    editorOpen,
    handleOpenEditor,
    handleCloseEditor,
    status,
    noCongReport,
  };
};

export default useDailyHistory;
