import { useAtom } from 'jotai';
import { isSupportOpenState } from '@states/app';

const useSupport = () => {
  const [isOpen, setIsOpen] = useAtom(isSupportOpenState);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenDonate = () => {
    window.open(`https://www.buymeacoffee.com/sws2apps`, '_blank');
  };

  const handleOpenDoc = () => {
    window.open(
      `https://guide.organized-app.com/how-to-support/contribute`,
      '_blank'
    );
  };

  return { isOpen, handleClose, handleOpenDoc, handleOpenDonate };
};

export default useSupport;
