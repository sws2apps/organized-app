import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksFilteredState, publicTalksSearchKeyState } from '@states/publicTalks';
import { setPublicTalksSearchKey } from '@services/recoil/publicTalks';

const usePublicTalks = () => {
  const talksList = useRecoilValue(publicTalksFilteredState);
  const txtSearch = useRecoilValue(publicTalksSearchKeyState);

  const [isExpandAll, setIsExpandAll] = useState(false);
  const [labelSearch, setLabelSearch] = useState('tr_countPublicTalks');

  const handleToggleExpandAll = () => {
    setIsExpandAll((prev) => !prev);
  };

  const handleSearch = async (value: string) => {
    await setPublicTalksSearchKey(value);
  };

  useEffect(() => {
    if (txtSearch.length === 0) {
      setLabelSearch('tr_countPublicTalks');
    }

    if (txtSearch.length > 0) {
      setLabelSearch('tr_searchResults');
    }
  }, [txtSearch]);

  return {
    talksList,
    isExpandAll,
    handleToggleExpandAll,
    handleSearch,
    labelSearch,
    txtSearch,
  };
};

export default usePublicTalks;
