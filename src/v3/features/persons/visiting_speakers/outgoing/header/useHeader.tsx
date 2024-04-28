import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congNameState, congNumberState } from '@states/settings';

const useHeader = () => {
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);

  const [openAccess, setOpenAcess] = useState(false);

  const handleOpenAccess = () => setOpenAcess(true);

  const handleCloseAccess = () => setOpenAcess(false);

  return { congName, congNumber, handleOpenAccess, handleCloseAccess, openAccess };
};

export default useHeader;
