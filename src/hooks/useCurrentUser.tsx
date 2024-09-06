import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { userLocalUIDState } from '@states/settings';
import { formatDate } from '@services/dateformat';

const useCurrentUser = () => {
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

  return { person, first_report };
};

export default useCurrentUser;
