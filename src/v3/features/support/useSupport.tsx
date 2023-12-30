import { useRecoilState } from 'recoil';
import { isSupportOpenState } from '@states/app';

const useSupport = () => {
  const [isOpen, setIsOpen] = useRecoilState(isSupportOpenState);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenDonate = () => {
    window.open(`https://www.buymeacoffee.com/sws2apps/e/146059`, '_blank');
  };

  const handleOpenDoc = () => {
    window.open(`https://github.com/sws2apps/cpe-sws/blob/main/CONTRIBUTING.md`, '_blank');
  };

  return { isOpen, handleClose, handleOpenDoc, handleOpenDonate };
};

export default useSupport;
