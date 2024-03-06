import { useState } from 'react';

const useMyProfile = () => {
  const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsLogoutConfirm(false);
  };

  return { isLogoutConfirm, handleOpenLogoutConfirm, handleCloseConfirm };
};

export default useMyProfile;
