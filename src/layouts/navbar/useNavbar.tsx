import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  setIsAboutOpen,
  setIsAppLoad,
  setIsContactOpen,
  setIsSetup,
  setIsSupportOpen,
  setOfflineOverride,
} from '@services/recoil/app';
import { useBreakpoints } from '@hooks/index';
import { congAccountConnectedState, isAppLoadState } from '@states/app';
import {
  accountTypeState,
  congNameState,
  fullnameState,
} from '@states/settings';

const useNavbar = () => {
  const navigate = useNavigate();

  const { laptopUp, tabletDown, tabletUp } = useBreakpoints();

  const fullname = useRecoilValue(fullnameState);
  const congName = useRecoilValue(congNameState);
  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);

  const [anchorEl, setAnchorEl] = useState(null);

  const openMore = Boolean(anchorEl);

  const handleOpenMoreMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleOpenMyProfile = () => {
    handleCloseMore();
    navigate(`/user-profile`);
  };

  const handleReconnectAccount = async () => {
    handleCloseMore();

    await setOfflineOverride(true);
    await setIsSetup(true);
    await setIsAppLoad(true);
  };

  const handleOpenContact = async () => {
    handleCloseMore();
    await setIsContactOpen(true);
  };

  const handleOpenAbout = async () => {
    handleCloseMore();
    await setIsAboutOpen(true);
  };

  const handleOpenSupport = async () => {
    handleCloseMore();
    await setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    handleCloseMore();
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  const handleOpenRealApp = () => {
    handleCloseMore();
    window.open(`https://organized-app.com`, '_blank');
  };

  return {
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleOpenRealApp,
    accountType,
  };
};

export default useNavbar;
