import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  personsActiveState,
  personsFilteredState,
  personsTabState,
} from '@states/persons';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useList = () => {
  const [activeTab, setActiveTab] = useAtom(personsTabState);

  const dataView = useAtomValue(userDataViewState);
  const persons = useAtomValue(personsFilteredState);
  const personsAll = useAtomValue(personsActiveState);
  const languageGroups = useAtomValue(languageGroupsState);

  const personsByView = useMemo(() => {
    const persons = personsAll.filter((record) => {
      if (dataView === 'main') return true;

      const group = languageGroups.find((g) => g.group_id === dataView);

      if (!group) return true;

      return group.group_data.members.some(
        (m) => m.person_uid === record.person_uid
      );
    });

    return persons;
  }, [personsAll, dataView, languageGroups]);

  const handleTabChange = (active: number) => {
    setActiveTab(active);
  };

  return { persons, activeTab, handleTabChange, personsByView };
};

export default useList;
