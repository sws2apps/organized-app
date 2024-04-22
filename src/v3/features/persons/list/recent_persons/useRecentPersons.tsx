import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState, personsRecentState } from '@states/persons';
import { PersonType } from '@definition/person';
import { updateRecentPersons } from '@services/app/persons';

const useRecentPersons = () => {
  const personsRecent = useRecoilValue(personsRecentState);
  const personsActive = useRecoilValue(personsActiveState);

  const persons = useMemo(() => {
    const result: PersonType[] = [];

    for (const person_uid of personsRecent) {
      const foundPerson = personsActive.find((record) => record.person_uid === person_uid);
      if (foundPerson) {
        result.push(foundPerson);
      } else {
        updateRecentPersons(person_uid, 'remove');
      }
    }

    return result.sort((a, b) => (a.person_lastname.value > b.person_lastname.value ? 1 : -1));
  }, [personsRecent, personsActive]);

  return { persons };
};

export default useRecentPersons;
