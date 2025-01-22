import { useMemo } from 'react';
import { FormS4Props } from './index.types';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePerson from '@features/persons/hooks/usePerson';

const useFormS4 = ({ month, person_uid, publisher }: FormS4Props) => {
  const { personIsEnrollmentActive } = usePerson();

  const { person, hours_credit_enabled } = useMinistryMonthlyRecord({
    month,
    person_uid,
    publisher,
  });

  const isHourEnabled = useMemo(() => {
    if (!person) return false;

    const isAP = personIsEnrollmentActive(person, 'AP', month);
    const isFMF = personIsEnrollmentActive(person, 'FMF', month);
    const isFR = personIsEnrollmentActive(person, 'FR', month);
    const isFS = personIsEnrollmentActive(person, 'FS', month);

    return isAP || isFMF || isFR || isFS;
  }, [person, month, personIsEnrollmentActive]);

  return { isHourEnabled, hours_credit_enabled };
};

export default useFormS4;
