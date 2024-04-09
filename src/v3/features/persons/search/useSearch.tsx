import { useState } from 'react';

const useSearch = () => {
  const [txtSearch, setTxtSearch] = useState('');

  const handleSearch = (value: string) => {
    setTxtSearch(value);
  };

  return { txtSearch, handleSearch };
};

export default useSearch;
