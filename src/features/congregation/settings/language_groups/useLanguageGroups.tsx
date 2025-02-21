import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  languageGroupEnabledState,
  languageGroupsState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const useLanguageGroups = () => {
  const enabled = useRecoilValue(languageGroupEnabledState);
  const isConnected = useRecoilValue(congAccountConnectedState);
  const languageGroups = useRecoilValue(languageGroupsState);

  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => setIsAdd(true);

  const handleCloseAdd = () => setIsAdd(false);

  return {
    enabled,
    isAdd,
    handleOpenAdd,
    handleCloseAdd,
    isConnected,
    languageGroups,
  };
};

export default useLanguageGroups;
