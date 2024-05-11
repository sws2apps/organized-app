import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congNameState, congNumberState } from '@states/settings';

const useHeader = () => {
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);

  const [openAccess, setOpenAccess] = useState(false);

  const handleOpenAccess = () => setOpenAccess(true);

  const handleCloseAccess = () => setOpenAccess(false);

  return { congName, congNumber, handleOpenAccess, handleCloseAccess, openAccess };
};

export default useHeader;
