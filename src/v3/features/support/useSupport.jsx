import { useRecoilState } from 'recoil';
import { isSupportOpenState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useSupport = () => {
  const { t } = useAppTranslation();

  const [isOpen, setIsOpen] = useRecoilState(isSupportOpenState);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenDoc = () => {
    window.open(`https://sws2apps.com/${t('docsUrlCode')}/category/congregation-program-for-everyone`, '_blank');
  };

  return { isOpen, handleClose, handleOpenDoc };
};

export default useSupport;
