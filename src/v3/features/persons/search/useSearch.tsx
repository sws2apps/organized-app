import { useRecoilState, useSetRecoilState } from 'recoil';
import { personsSearchKeyState, personsTabState } from '@states/persons';
import { PersonsTab } from '@definition/person';

const useSearch = () => {
  const setActiveTab = useSetRecoilState(personsTabState);
  const [txtSearch, setTxtSearch] = useRecoilState(personsSearchKeyState);

  const handleSearch = (value: string) => {
    setTxtSearch(value);
    setActiveTab(PersonsTab.ALL);
  };

  return { txtSearch, handleSearch };
};

export default useSearch;
