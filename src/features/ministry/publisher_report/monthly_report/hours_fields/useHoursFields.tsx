import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import { HourCreditItemType } from './index.types';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useHoursFields = () => {
  const reportMonth = useRecoilValue(reportUserSelectedMonthState);

  const { approved_assignments } = useMinistryMonthlyRecord(reportMonth);

  const hoursCredits = useMemo(() => {
    const result: HourCreditItemType[] = [];

    if (approved_assignments > 0) {
      result.push({
        event: 'approved_assignment',
        value: approved_assignments,
      });
    }

    return result;
  }, [approved_assignments]);

  return { hoursCredits };
};

export default useHoursFields;
