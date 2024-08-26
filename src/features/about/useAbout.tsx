import { useRecoilValue } from 'recoil';
import { isAboutOpenState } from '@states/app';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { AboutProps } from './index.types';

const currentYear = new Date().getFullYear();

const useAbout = ({ updatePwa }: AboutProps) => {
  const isOpen = useRecoilValue(isAboutOpenState);

  const handleForceReload = () => {
    try {
      updatePwa();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
    }
  };

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

  return {
    isOpen,
    handleClose,
    currentYear,
    handleOpenDoc,
    handleOpenSupport,
    handleForceReload,
  };
};

export default useAbout;
