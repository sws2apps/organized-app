import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  personsActiveState,
  personsFilteredState,
  personsTabState,
} from '@states/persons';
import { userDataViewState } from '@states/settings';

const useList = () => {
  const [activeTab, setActiveTab] = useRecoilState(personsTabState);

  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsFilteredState);
  const personsAll = useRecoilValue(personsActiveState);

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
