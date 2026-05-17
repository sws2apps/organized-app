import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import usePwaInstall from '@hooks/usePwaInstall';
import {
  disconnectCongAccount,
  setIsAboutOpen,
  setIsAppLoad,
  setIsContactOpen,
  setIsSetup,
  setIsSupportOpen,
  setOfflineOverride,
} from '@services/states/app';
import { useBreakpoints } from '@hooks/index';
import {
  congAccountConnectedState,
  isAppLoadState,
  navBarAnchorElState,
  navBarOptionsState,
} from '@states/app';
import {
  accountTypeState,
  congNameState,
  fullnameState,
} from '@states/settings';
import { userSignOut } from '@services/firebase/auth';

const useNavbar = () => {
  const navigate = useNavigate();

  const { isPwaInstallable, installPwa: pwaInstall } = usePwaInstall();

  // Targets all Apple devices (iPhone, iPad, iPod, Mac)
  const isAppleDevice = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

  const [iosDialogOpen, setIosDialogOpen] = useState(false);
  const handleOpenIosDialog = () => setIosDialogOpen(true);
  const handleCloseIosDialog = () => setIosDialogOpen(false);

  const { laptopUp, tabletDown, tabletUp, desktopUp, tablet688Up } =
    useBreakpoints();

  const [anchorEl, setAnchorEl] = useAtom(navBarAnchorElState);

  const fullname = useAtomValue(fullnameState);
  const congName = useAtomValue(congNameState);
  const isCongAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);
  const accountType = useAtomValue(accountTypeState);

  const navBarOptions = useAtomValue(navBarOptionsState);

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuickSettings = (e) => {
    e.stopPropagation();
    navBarOptions.quickSettings();
  };

  const handleReconnectAccount = () => {
    handleCloseMore();

    setOfflineOverride(true);
    setIsSetup(true);
    setIsAppLoad(true);
  };

  const handleOpenContact = async () => {
    handleCloseMore();
    setIsContactOpen(true);
  };

  const handleOpenAbout = () => {
    handleCloseMore();
    setIsAboutOpen(true);
  };

  const handleOpenSupport = () => {
    handleCloseMore();
    setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    handleCloseMore();
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  const handleOpenRealApp = () => {
    handleCloseMore();
    window.open(`https://organized-app.com`, '_blank');
  };

  const handleInstallApp = () => {
    handleCloseMore();
    if (isAppleDevice && !isPwaInstallable) {
      handleOpenIosDialog();
    } else {
      pwaInstall();
    }
  };

  const handleDisonnectAccount = async () => {
    handleCloseMore();

    await userSignOut();
    disconnectCongAccount();

    globalThis.location.reload();
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
    handleDisonnectAccount,
    navBarOptions,
    handleBack,
    desktopUp,
    handleQuickSettings,
    tablet688Up,
    isPwaInstallable,
    handleInstallApp,
    isAppleDevice,
    iosDialogOpen,
    handleCloseIosDialog,
  };
};

export default useNavbar;
