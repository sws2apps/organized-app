import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import {
  personIsAP,
  personIsFMF,
  personIsFR,
  personIsFS,
} from '@services/app/persons';
import { currentMonthServiceYear } from '@utils/date';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistry = () => {
  const { person, enable_AP_application } = useCurrentUser();

  const currentMonth = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const { hours_total } = useMinistryMonthlyRecord({
    month: currentMonth,
    person_uid: person.person_uid,
    publisher: true,
  });

  const isPioneer = useMemo(() => {
    if (!person) return false;

    const isAP = personIsAP(person);
    const isFR = personIsFR(person);
    const isFS = personIsFS(person);
    const isFMF = personIsFMF(person);

    return isAP || isFR || isFS || isFMF;
  }, [person]);

  return { isPioneer, hours_total, enable_AP_application };
};

export default useMinistry;
