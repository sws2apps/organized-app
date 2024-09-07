import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useCreditItem = () => {
  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const { hours_credit } = useMinistryMonthlyRecord(currentMonth);

  const total_hours = useMemo(() => {
    return `${hours_credit}:00`;
  }, [hours_credit]);

  return { total_hours };
};

export default useCreditItem;
