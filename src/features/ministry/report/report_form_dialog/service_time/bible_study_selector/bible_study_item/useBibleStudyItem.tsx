import { MouseEvent, useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  bibleStudyEditorOpenState,
  currentBibleStudyState,
} from '@states/user_bible_studies';
import { BibleStudyItemProps } from './index.types';
import { reportUserDraftState } from '@states/user_field_service_reports';

const useBibleStudyItem = ({
  bibleStudy,
  onSelectorClose,
}: BibleStudyItemProps) => {
  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const setEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);
  const setCurrentStudy = useSetRecoilState(currentBibleStudyState);

  const selected = useMemo(() => {
    if (!currentReport) return false;

    return currentReport.report_data.bible_studies.records.includes(
      bibleStudy.person_uid
    );
  }, [currentReport, bibleStudy]);

  const handleEditStudy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onSelectorClose?.();

    setCurrentStudy(bibleStudy);
    setEditorOpen(true);
  };

  const handleSelectStudy = () => {
    const report = structuredClone(currentReport);

    report.report_data.bible_studies.records =
      report.report_data.bible_studies.records.filter(
        (record) => record !== bibleStudy.person_uid
      );
    report.report_data.bible_studies.records.push(bibleStudy.person_uid);

    const cnCount = report.report_data.bible_studies.value;
    report.report_data.bible_studies.value = cnCount ? cnCount + 1 : 1;

    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);

    onSelectorClose?.();
  };

  return { handleEditStudy, handleSelectStudy, selected };
};

export default useBibleStudyItem;
