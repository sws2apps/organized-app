import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  circuitNumberState,
  congNameState,
  congNumberState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const useHeader = () => {
  const congName = useAtomValue(congNameState);
  const congNumber = useAtomValue(congNumberState);
  const congAccountConnected = useAtomValue(congAccountConnectedState);
  const circuitNumber = useAtomValue(circuitNumberState);

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
