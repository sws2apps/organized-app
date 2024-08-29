import { useRecoilState } from 'recoil';
import { BibleStudyItemProps } from './index.types';
import { reportUserDraftState } from '@states/user_field_service_reports';

const useBibleStudyItem = ({ bibleStudy }: BibleStudyItemProps) => {
  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const handleDeleteStudy = () => {
    if (!currentReport) return;

    const report = structuredClone(currentReport);

    report.report_data.bible_studies.records =
      report.report_data.bible_studies.records.filter(
        (record) => record !== bibleStudy.person_uid
      );

    const cnCount = report.report_data.bible_studies.value;
    report.report_data.bible_studies.value = cnCount - 1;

    report.report_data.updatedAt = new Date().toISOString();

    setCurrentReport(report);
  };

  return { handleDeleteStudy };
};

export default useBibleStudyItem;
