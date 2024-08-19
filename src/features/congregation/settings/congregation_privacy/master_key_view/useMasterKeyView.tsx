import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congMasterKeyState } from '@states/settings';

const useMasterKeyView = () => {
  const masterKey = useRecoilValue(congMasterKeyState);

  const [changeOpen, setChangeOpen] = useState(false);

  const handleOpenChange = () => setChangeOpen(true);

  const handleCloseChange = () => setChangeOpen(false);

  return { masterKey, changeOpen, handleOpenChange, handleCloseChange };
};

export default useMasterKeyView;
