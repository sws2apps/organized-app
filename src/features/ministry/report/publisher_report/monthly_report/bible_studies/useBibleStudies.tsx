import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useBibleStudies = () => {
  const currentMonth = useRecoilValue(reportUserSelectedMonthState);

  const { bible_studies_names, bible_studies } =
    useMinistryMonthlyRecord(currentMonth);

  return {
    bible_studies_names,
    bible_studies,
  };
};

export default useBibleStudies;
