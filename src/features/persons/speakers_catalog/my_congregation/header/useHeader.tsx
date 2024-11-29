import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  circuitNumberState,
  congNameState,
  congNumberState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const useHeader = () => {
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const circuitNumber = useRecoilValue(circuitNumberState);

  const [openAccess, setOpenAccess] = useState(false);

  const handleOpenAccess = () => setOpenAccess(true);

  const handleCloseAccess = () => setOpenAccess(false);

  return {
    congName,
    congNumber,
    circuitNumber,
    handleOpenAccess,
    handleCloseAccess,
    openAccess,
    congAccountConnected,
  };
};

export default useHeader;
