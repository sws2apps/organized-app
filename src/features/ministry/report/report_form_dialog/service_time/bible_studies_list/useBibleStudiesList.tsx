import { useAtomValue } from 'jotai';
import { reportUserDraftState } from '@states/user_field_service_reports';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';

const useBibleStudiesList = () => {
  const report = useAtomValue(reportUserDraftState);

  const { bibleStudies } = useMinistryDailyRecord(report);

  return { selectedBibleStudies: bibleStudies.records };
};

export default useBibleStudiesList;
