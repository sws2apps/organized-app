import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congAccessCodeState } from '@states/settings';

const useAccessCodeView = () => {
  const accessCode = useRecoilValue(congAccessCodeState);

  const [changeOpen, setChangeOpen] = useState(false);

  const handleOpenChange = () => setChangeOpen(true);

  const handleCloseChange = () => setChangeOpen(false);

  return { accessCode, changeOpen, handleOpenChange, handleCloseChange };
};

export default useAccessCodeView;
