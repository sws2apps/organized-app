import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { dayNamesState, monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';

const useDailyRecords = (report: UserFieldServiceDailyReportType) => {
  const { t } = useAppTranslation();

  const setBibleStudyEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);

  const monthNames = useRecoilValue(monthNamesState);
  const dayNames = useRecoilValue(dayNamesState);

  const [showEdit, setShowEdit] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const fullDate = useMemo(() => {
    if (!report) return '';

    const reportDate = new Date(report.report_date);

    const year = reportDate.getFullYear();
    const month = reportDate.getMonth();
    const date = reportDate.getDate();
    const day = reportDate.getDay();

    const monthName = monthNames[month];
    const dayName = dayNames[day];

    return t('tr_longDateWithYearAndDayLocale', {
      year,
      month: monthName,
      date,
      day: dayName,
    });
  }, [report, monthNames, dayNames, t]);

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
  };
};

export default useDailyRecords;
