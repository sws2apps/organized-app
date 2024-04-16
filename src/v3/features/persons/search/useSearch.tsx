import { useRecoilState } from 'recoil';
import { personsSearchKeyState } from '@states/persons';

const useSearch = () => {
  const [txtSearch, setTxtSearch] = useRecoilState(personsSearchKeyState);

  const handleSearch = (value: string) => {
    setTxtSearch(value);
  };

  return { txtSearch, handleSearch };
};

export default useSearch;
