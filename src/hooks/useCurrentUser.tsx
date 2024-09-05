import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { userLocalUIDState } from '@states/settings';
import { formatDate } from '@services/dateformat';

const useHookCurrentUser = () => {
  const userUID = useRecoilValue(userLocalUIDState);
  const persons = useRecoilValue(personsState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === userUID);
  }, [persons, userUID]);

  const first_report = useMemo(() => {
    if (!person) return;

    const isBaptized = person.person_data.publisher_baptized.active.value;
    const isUnbaptized = person.person_data.publisher_unbaptized.active.value;

    const isPublisher = isBaptized || isUnbaptized;

    if (!isPublisher) return;

    if (isBaptized) {
      const record = person.person_data.publisher_baptized.history.find(
        (record) => record._deleted === false && record.start_date?.length > 0
      );

      return formatDate(new Date(record.start_date), 'yyyy/MM');
    }

    if (!isBaptized) {
      const record = person.person_data.publisher_unbaptized.history.find(
        (record) => record._deleted === false && record.start_date?.length > 0
      );

      return formatDate(new Date(record.start_date), 'yyyy/MM');
    }
  }, [person]);

  return { person, first_report };
};

export default useHookCurrentUser;
