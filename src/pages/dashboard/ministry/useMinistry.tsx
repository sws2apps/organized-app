import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import {
  personIsAP,
  personIsFMF,
  personIsFR,
  personIsFS,
} from '@services/app/persons';
import { currentMonthServiceYear, currentServiceYear } from '@utils/date';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePioneerStats from '@features/ministry/service_year/yearly_stats/pioneer_stats/usePioneerStats';

const useMinistry = () => {
  const { person, enable_AP_application } = useCurrentUser();

  const currentMonth = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const currentSY = useMemo(() => {
    return currentServiceYear();
  }, []);

  const { hours_balance } = usePioneerStats(currentSY);

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

  const hours = useMemo(() => {
    if (hours_total.indexOf(':') === -1) {
      return `${hours_total}:00`;
    }

    return hours_total;
  }, [hours_total]);

  return {
    isPioneer,
    hours,
    hours_balance: String(hours_balance),
    enable_AP_application,
  };
};

export default useMinistry;
