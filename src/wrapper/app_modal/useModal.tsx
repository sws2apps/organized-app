import { useAtom } from 'jotai';
import { rootModalOpenState } from '@states/app';

const useModal = () => {
  const [open, setOpen] = useAtom(rootModalOpenState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return { open, setOpen, handleClose };
};

export default useModal;
