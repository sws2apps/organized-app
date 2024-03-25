import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isMFAEnabledState } from '@states/app';

const useSecurity = () => {
  const isMFAEnabled = useRecoilValue(isMFAEnabledState);

  const [isOpenMFAEnable, setIsOpenMFAEnable] = useState(false);
  const [isOpenMFADisable, setIsOpenMFADisable] = useState(false);

  const handleToggleMFA = async (value) => {
    if (value) {
      setIsOpenMFAEnable(true);
    }

    if (!value) {
      setIsOpenMFADisable(true);
    }
  };

  const handleCloseDialog = () => {
    setIsOpenMFAEnable(false);
    setIsOpenMFADisable(false);
  };

  return { isMFAEnabled, handleToggleMFA, isOpenMFAEnable, isOpenMFADisable, handleCloseDialog };
};

export default useSecurity;
