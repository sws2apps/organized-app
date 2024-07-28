import { useRecoilValue } from 'recoil';
import { isContactOpenState } from '@states/app';
import { setIsContactOpen } from '@services/recoil/app';

const useContact = () => {
  const isOpen = useRecoilValue(isContactOpenState);

  const handleClose = async () => {
    await setIsContactOpen(false);
  };

  const handleOpen = async () => {
    await setIsContactOpen(true);
  };

  const handleToggle = async () => {
    await setIsContactOpen(!isOpen);
  };

  return { isOpen, handleClose, handleOpen, handleToggle };
};

export default useContact;
