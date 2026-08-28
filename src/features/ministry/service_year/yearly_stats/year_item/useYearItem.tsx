import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';
import { useCurrentUser } from '@hooks/index';
import { personIsInfirmPioneer } from '@services/app/persons';

const useYearItem = (year: string) => {
  const { person } = useCurrentUser();

  const { hours, isFR, isFS, hoursEnabled } = useMinistryYearlyRecord(year);

  const isInfirm = person ? personIsInfirmPioneer(person) : false;

  return { hours, hoursEnabled, isFR, isFS, isInfirm };
};

export default useYearItem;
