import { useRecoilState, useRecoilValue } from 'recoil';
import { personsActiveState, personsFilteredState, personsTabState } from '@states/persons';

const useList = () => {
  const [activeTab, setActiveTab] = useRecoilState(personsTabState);
  const persons = useRecoilValue(personsFilteredState);
  const personsAll = useRecoilValue(personsActiveState);

  const handleTabChange = (active: number) => {
    setActiveTab(active);
  };

  return { persons, activeTab, handleTabChange, personsAll };
};

export default useList;
