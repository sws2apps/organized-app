import { useRecoilState, useRecoilValue } from 'recoil';
import { personsFilteredState, personsTabState } from '@states/persons';

const useList = () => {
  const [activeTab, setActiveTab] = useRecoilState(personsTabState);
  const persons = useRecoilValue(personsFilteredState);

  const handleTabChange = (active: number) => {
    setActiveTab(active);
  };

  return { persons, activeTab, handleTabChange };
};

export default useList;
