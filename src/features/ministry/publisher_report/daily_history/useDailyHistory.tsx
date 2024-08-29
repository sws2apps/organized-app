import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceReportsState,
} from '@states/user_field_service_reports';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';

const useDailyHistory = () => {
  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const reportMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const [editorOpen, setEditorOpen] = useState(false);

  const dailyReports = useMemo(() => {
    if (reportMonth.length === 0) return [];

    const results = reports.filter(
      (record) =>
        record.report_data.record_type === 'daily' &&
        record.report_date.includes(reportMonth)
    );

    return results as UserFieldServiceDailyReportType[];
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
  };
};

export default useDailyHistory;
