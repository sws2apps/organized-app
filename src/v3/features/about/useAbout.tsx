import { useRecoilValue } from 'recoil';
import { isAboutOpenState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';

const currentYear = new Date().getFullYear();

const useAbout = () => {
  const { t } = useAppTranslation();

  const isOpen = useRecoilValue(isAboutOpenState);

  const handleClose = async () => {
    await setIsAboutOpen(false);
  };

  const handleOpenSupport = async () => {
    await setIsAboutOpen(false);
    await setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    window.open(`https://sws2apps.com/${t('trans_docsUrlCode')}/category/congregation-program-for-everyone`, '_blank');
  };

  return { isOpen, handleClose, currentYear, handleOpenDoc, handleOpenSupport };
};

export default useAbout;
