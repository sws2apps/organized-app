import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { congAccessCodeState } from '@states/settings';

const useAccessCodeView = () => {
  const accessCode = useAtomValue(congAccessCodeState);

  const [changeOpen, setChangeOpen] = useState(false);

  const handleOpenChange = () => setChangeOpen(true);

  const handleCloseChange = () => setChangeOpen(false);

  return { accessCode, changeOpen, handleOpenChange, handleCloseChange };
};

export default useAccessCodeView;
