import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { personsActiveState, personsRecentState } from '@states/persons';
import { PersonType } from '@definition/person';
import { personsSortByName, updateRecentPersons } from '@services/app/persons';
import { userDataViewState } from '@states/settings';

const useRecentPersons = () => {
  const personsRecent = useAtomValue(personsRecentState);
  const personsActive = useAtomValue(personsActiveState);
  const dataView = useAtomValue(userDataViewState);

  const personsByView = useMemo(() => {
    return personsActive.filter((record) => {
      if (Array.isArray(record.person_data.categories)) {
        if (dataView === 'main') return true;

        return false;
      }

      return record.person_data.categories.value.includes(dataView);
    });
  }, [personsActive, dataView]);

  const persons = useMemo(() => {
    const result: PersonType[] = [];

    for (const person_uid of personsRecent) {
      const foundPerson = personsByView.find(
        (record) => record.person_uid === person_uid
      );
      if (foundPerson) {
        result.push(foundPerson);
      } else {
        updateRecentPersons(person_uid, 'remove');
      }
    }

    return personsSortByName(result);
  }, [personsRecent, personsByView]);

  return { persons };
};

export default useRecentPersons;
