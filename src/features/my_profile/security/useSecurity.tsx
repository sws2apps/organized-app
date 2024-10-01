import { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isMFAEnabledState } from '@states/app';

const useSecurity = () => {
  const isMFAEnabled = useRecoilValue(isMFAEnabledState);

  const [isOpenMFAEnable, setIsOpenMFAEnable] = useState(false);
  const [isOpenMFADisable, setIsOpenMFADisable] = useState(false);

  const handleToggleMFA = () => {
    if (!isMFAEnabled) {
      setIsOpenMFAEnable(true);
    }

    if (isMFAEnabled) {
      setIsOpenMFADisable(true);
    }
  };

  const handleCloseDialog = useCallback(() => {
    setIsOpenMFAEnable(false);
    setIsOpenMFADisable(false);
  }, []);

  return {
    isMFAEnabled,
    handleToggleMFA,
    isOpenMFAEnable,
    isOpenMFADisable,
    handleCloseDialog,
  };
};

export default useSecurity;
