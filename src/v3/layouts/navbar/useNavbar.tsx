import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { setIsAboutOpen, setIsAppLoad, setIsSetup, setIsSupportOpen, setOfflineOverride } from '@services/recoil/app';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { congAccountConnectedState, isAppLoadState } from '@states/app';
import { congNameState, fullnameState } from '@states/settings';

const useNavbar = () => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const { laptopUp, tablet600Up, tabletDown, tabletUp } = useBreakpoints();

  const fullname = useRecoilValue(fullnameState);
  const congName = useRecoilValue(congNameState);
  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
  const isAppLoad = useRecoilValue(isAppLoadState);

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

    setTimeout(() => {
      navigate(`/my-profile`);
    }, 500);
  };

  const handleReconnectAccount = async () => {
    handleCloseMore();

    await setOfflineOverride(true);
    await setIsSetup(true);
    await setIsAppLoad(true);
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
    window.open(`https://sws2apps.com/${t('tr_docsUrlCode')}/category/congregation-program-for-everyone`, '_blank');
  };

  return {
    tablet600Up,
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
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
  };
};

export default useNavbar;
