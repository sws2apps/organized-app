import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserDraftState } from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';

const useBibleStudiesList = () => {
  const bibleStudies = useRecoilValue(userBibleStudiesState);

  const report = useRecoilValue(reportUserDraftState);

  const selectedBibleStudies = useMemo(() => {
    if (!report) return [];

    const result = report.report_data.bible_studies.records.map((study) => {
      const found = bibleStudies.find((record) => record.person_uid === study);

      return found;
    });

    return result;
  }, [report, bibleStudies]);

  return { selectedBibleStudies };
};

export default useBibleStudiesList;
