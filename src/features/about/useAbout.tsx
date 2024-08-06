import { useRecoilValue } from 'recoil';
import { isAboutOpenState } from '@states/app';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';

const currentYear = new Date().getFullYear();

const useAbout = () => {
  const isOpen = useRecoilValue(isAboutOpenState);

  const handleClose = async () => {
    await setIsAboutOpen(false);
  };

  const handleOpenSupport = async () => {
    await setIsAboutOpen(false);
    await setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  return { isOpen, handleClose, currentYear, handleOpenDoc, handleOpenSupport };
};

export default useAbout;
