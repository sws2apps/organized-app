import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { isAppLoadState } from '@states/app';
import { congNameState, fullnameState } from '@states/settings';

const useNavbar = () => {
  const { t } = useAppTranslation();

  const { laptopUp, tablet600Up, tabletDown, tabletUp } = useBreakpoints();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const fullname = useRecoilValue(fullnameState);
  const congName = useRecoilValue(congNameState);

  const [anchorEl, setAnchorEl] = useState(null);

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
    isAppLoad,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
  };
};

export default useNavbar;
