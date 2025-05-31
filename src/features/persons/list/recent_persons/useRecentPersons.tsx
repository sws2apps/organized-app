import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { personsActiveState, personsRecentState } from '@states/persons';
import { PersonType } from '@definition/person';
import { personsSortByName, updateRecentPersons } from '@services/app/persons';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useRecentPersons = () => {
  const personsRecent = useAtomValue(personsRecentState);
  const personsActive = useAtomValue(personsActiveState);
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const personsByView = useMemo(() => {
    const persons = personsActive.filter((record) => {
      if (dataView === 'main') return true;

      const group = languageGroups.find((g) => g.group_id === dataView);

      if (!group) return true;

      return group.group_data.members.some(
        (m) => m.person_uid === record.person_uid
      );
    });

    return persons;
  }, [personsActive, dataView, languageGroups]);

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
