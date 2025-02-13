import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';
import { AssignmentCode } from '@definition/assignment';

const useHoursStats = (year: string) => {
  const { person } = useCurrentUser();

  const { hours, isFR } = useMinistryYearlyRecord(year);

  return { isFR, hours };
};

export default useHoursStats;
