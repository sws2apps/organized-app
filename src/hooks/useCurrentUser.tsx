import { useMemo } from 'react';
import { useRecoilValue, waitForAllSettled } from 'recoil';
import { personsState } from '@states/persons';
import { userLocalUIDState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import usePerson from '@features/persons/hooks/usePerson';

const useCurrentUser = () => {
  const { personIsEnrollmentActive, personIsBaptizedPublisher } = usePerson();

  const userUID = useRecoilValue(userLocalUIDState);
  const persons = useRecoilValue(personsState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === userUID);
  }, [persons, userUID]);

  const first_report = useMemo(() => {
    if (!person) return;

    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return;

    const firstDate = new Date(history.at(0).start_date);

    return formatDate(firstDate, 'yyyy/MM');
  }, [person]);

  const enable_AP_application = useMemo(() => {
    if (!person) return waitForAllSettled;

    const isBaptized = personIsBaptizedPublisher(person);

    if (!isBaptized) return false;

    const isAP = personIsEnrollmentActive(person, 'AP');
    const isFMF = personIsEnrollmentActive(person, 'FMF');
    const isFR = personIsEnrollmentActive(person, 'FR');
    const isFS = personIsEnrollmentActive(person, 'FS');

    const hasEnrollments = isAP || isFMF || isFR || isFS;

    return !hasEnrollments;
  }, [person]);

  return { person, first_report, enable_AP_application };
};

export default useCurrentUser;
