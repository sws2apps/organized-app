import { congAccountConnectedState } from '@states/app';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const useMyProfile = () => {
  const isConnected = useRecoilValue(congAccountConnectedState);

  const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsLogoutConfirm(false);
  };

  return { isLogoutConfirm, handleOpenLogoutConfirm, handleCloseConfirm, isConnected };
};

export default useMyProfile;
