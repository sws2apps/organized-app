import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { congMasterKeyState } from '@states/settings';

const useMasterKeyView = () => {
  const masterKey = useAtomValue(congMasterKeyState);

  const [changeOpen, setChangeOpen] = useState(false);

  const handleOpenChange = () => setChangeOpen(true);

  const handleCloseChange = () => setChangeOpen(false);

  return { masterKey, changeOpen, handleOpenChange, handleCloseChange };
};

export default useMasterKeyView;
