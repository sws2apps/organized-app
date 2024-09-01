import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
} from '@states/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useDailyHistory = () => {
  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const reportMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceDailyReportsState);

  const { status } = useMinistryMonthlyRecord(reportMonth);

  const [editorOpen, setEditorOpen] = useState(false);

  const handleOpenEditor = () => setEditorOpen(true);

  const dailyReports = useMemo(() => {
    if (!reportMonth || reportMonth.length === 0) return [];

    return reports
      .filter((record) => record.report_date.includes(reportMonth))
      .sort((a, b) => b.report_date.localeCompare(a.report_date));
  }, [reportMonth, reports]);

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
  };
};

export default useDailyHistory;
