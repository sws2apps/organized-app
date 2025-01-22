import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import { userLocalUIDState } from '@states/settings';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useDailyRecord = (report: UserFieldServiceDailyReportType) => {
  const { fullDate, total_hours } = useMinistryDailyRecord(report);

  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);
  const userUID = useRecoilValue(userLocalUIDState);

  const { status } = useMinistryMonthlyRecord({
    month: selectedMonth,
    publisher: true,
    person_uid: userUID,
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleShowEdit = () => {
    if (editorOpen) {
      setShowEdit(false);
      return;
    }

    setShowEdit(true);
  };

  const handleHideEdit = () => {
    setShowEdit(false);
  };

  const handleOpenEditor = () => {
    setShowEdit(false);
    setEditorOpen(true);
  };
  const handleCloseEditor = () => {
    setTimeout(() => {
      setEditorOpen(false);
      setBibleStudyEditorOpen(false);
    }, 250);
  };

  return {
    fullDate,
    showEdit,
    handleShowEdit,
    handleHideEdit,
    editorOpen,
    handleOpenEditor,
    handleCloseEditor,
    total_hours,
    status,
  };
};

export default useDailyRecord;
