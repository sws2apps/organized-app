import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { languageGroupEnabledState } from '@states/settings';

const useLanguageGroups = () => {
  const enabled = useRecoilValue(languageGroupEnabledState);

  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => setIsAdd(true);

  const handleCloseAdd = () => setIsAdd(false);

  return {
    enabled,
    isAdd,
    handleOpenAdd,
    handleCloseAdd,
  };
};

export default useLanguageGroups;
