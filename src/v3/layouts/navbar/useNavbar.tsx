import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMediaQuery, useTheme } from '@mui/material';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { isAppLoadState } from '@states/app';
import { congNameState, fullnameState } from '@states/settings';

const useNavbar = () => {
  const { t } = useAppTranslation();

  const theme = useTheme();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const fullname = useRecoilValue(fullnameState);
  const congName = useRecoilValue(congNameState);

  const [anchorEl, setAnchorEl] = useState(null);

  const tablet600Up = useMediaQuery(theme.breakpoints.up('tablet600'), {
    noSsr: true,
  });

  const mobileUp = useMediaQuery(theme.breakpoints.up('mobile'), {
    noSsr: true,
  });

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const openMore = Boolean(anchorEl);

  const handleOpenMoreMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
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
    window.open(`https://sws2apps.com/${t('trans_docsUrlCode')}/category/congregation-program-for-everyone`, '_blank');
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
    isAppLoad,
    fullname,
    congName,
    mobileUp,
    tabletUp,
    laptopUp,
  };
};

export default useNavbar;
