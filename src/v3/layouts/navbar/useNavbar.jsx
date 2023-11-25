import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMediaQuery, useTheme } from '@mui/material';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { isAppLoadState } from '@states/app';
import { avatarUrlState, congNameState, usernameState } from '@states/settings';

const useNavbar = () => {
  const { t } = useAppTranslation();

  const theme = useTheme();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const username = useRecoilValue(usernameState);
  const congName = useRecoilValue(congNameState);
  const userAvatar = useRecoilValue(avatarUrlState);

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
    isAppLoad,
    username,
    congName,
    userAvatar,
  };
};

export default useNavbar;
