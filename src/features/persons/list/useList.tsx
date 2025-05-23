import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  personsActiveState,
  personsFilteredState,
  personsTabState,
} from '@states/persons';
import { userDataViewState } from '@states/settings';

const useList = () => {
  const [activeTab, setActiveTab] = useAtom(personsTabState);

  const dataView = useAtomValue(userDataViewState);
  const persons = useAtomValue(personsFilteredState);
  const personsAll = useAtomValue(personsActiveState);

  const personsByView = useMemo(() => {
    return personsAll.filter((record) => {
      if (Array.isArray(record.person_data.categories)) {
        if (dataView === 'main') return true;

        return false;
      }

      return record.person_data.categories.value.includes(dataView);
    });
  }, [personsAll, dataView]);

  const handleTabChange = (active: number) => {
    setActiveTab(active);
  };

  return { persons, activeTab, handleTabChange, personsByView };
};

export default useList;
