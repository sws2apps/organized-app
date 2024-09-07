import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useHoursFields = () => {
  const reportMonth = useRecoilValue(reportUserSelectedMonthState);

  const { hours_credit } = useMinistryMonthlyRecord(reportMonth);

  return { hours_credit };
};

export default useHoursFields;
