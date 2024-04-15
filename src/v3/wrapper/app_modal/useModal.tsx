import { useRecoilState } from 'recoil';
import { rootModalOpenState } from '@states/app';

const useModal = () => {
  const [open, setOpen] = useRecoilState(rootModalOpenState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return { open, setOpen, handleClose };
};

export default useModal;
