import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';

const useNavbar = () => {
  const { t } = useAppTranslation();

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet600'), {
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
    window.open(`https://sws2apps.com/${t('docsUrlCode')}/category/congregation-program-for-everyone`, '_blank');
  };

  return {
    tabletUp,
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
  };
};

export default useNavbar;
