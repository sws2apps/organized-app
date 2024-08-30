import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';

const useDailyRecord = (report: UserFieldServiceDailyReportType) => {
  const { fullDate, total_hours } = useMinistryDailyRecord(report);

  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const [showEdit, setShowEdit] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleShowEdit = () => {
    if (editorOpen) {
      setShowEdit(false);
      return;
    }

    setShowEdit(true);
  };

  const handleHideEdit = () => setShowEdit(false);

  const handleOpenEditor = () => {
    setShowEdit(false);
    setEditorOpen(true);
  };
  const handleCloseEditor = () => {
    setEditorOpen(false);
    setBibleStudyEditorOpen(false);
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
  };
};

export default useDailyRecord;
