import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { languageGroupEnabledState } from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const useLanguageGroups = () => {
  const enabled = useRecoilValue(languageGroupEnabledState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => setIsAdd(true);

  const handleCloseAdd = () => setIsAdd(false);

  return {
    enabled,
    isAdd,
    handleOpenAdd,
    handleCloseAdd,
    isConnected,
  };
};

export default useLanguageGroups;
