import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';
import { AssignmentCode } from '@definition/assignment';

const useHoursStats = (year: string) => {
  const { person } = useCurrentUser();

  const { hours, isFR } = useMinistryYearlyRecord(year);

  const hoursCreditEnabled = useMemo(() => {
    const result = person.person_data.assignments.some(
      (record) =>
        record._deleted === false &&
        record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );

    return result;
  }, [person]);

  return { isFR, hours, hoursCreditEnabled };
};

export default useHoursStats;
