import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
} from '@states/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';

const useDailyHistory = () => {
  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const reportMonth = useRecoilValue(reportUserSelectedMonthState);
  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);

  const [editorOpen, setEditorOpen] = useState(false);

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
