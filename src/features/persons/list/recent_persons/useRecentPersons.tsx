import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState, personsRecentState } from '@states/persons';
import { PersonType } from '@definition/person';
import { updateRecentPersons } from '@services/app/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState, userDataViewState } from '@states/settings';

const useRecentPersons = () => {
  const personsRecent = useRecoilValue(personsRecentState);
  const personsActive = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const dataView = useRecoilValue(userDataViewState);

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

    return result.sort((a, b) => {
      const fullnameA = buildPersonFullname(
        a.person_data.person_lastname.value,
        a.person_data.person_firstname.value,
        fullnameOption
      );
      const fullnameB = buildPersonFullname(
        b.person_data.person_lastname.value,
        b.person_data.person_firstname.value,
        fullnameOption
      );

      return fullnameA > fullnameB ? 1 : -1;
    });
  }, [personsRecent, personsByView, fullnameOption]);

  return { persons };
};

export default useRecentPersons;
