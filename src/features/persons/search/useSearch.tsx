import { useAtom, useSetAtom } from 'jotai';
import { personsSearchKeyState, personsTabState } from '@states/persons';
import { PersonsTab } from '@definition/person';

const useSearch = () => {
  const setActiveTab = useSetAtom(personsTabState);
  const [txtSearch, setTxtSearch] = useAtom(personsSearchKeyState);

  const handleSearch = (value: string) => {
    setTxtSearch(value);
    setActiveTab(PersonsTab.ALL);
  };

  return { txtSearch, handleSearch };
};

export default useSearch;
