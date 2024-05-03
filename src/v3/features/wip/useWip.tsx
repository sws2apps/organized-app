import { useRecoilState } from 'recoil';
import { isWIPSnackOpenState } from '@states/app';

const useWip = () => {
  const [isOpen, setIsOpen] = useRecoilState(isWIPSnackOpenState);

  const handleClose = () => setIsOpen(false);

  return { isOpen, handleClose };
};

export default useWip;
