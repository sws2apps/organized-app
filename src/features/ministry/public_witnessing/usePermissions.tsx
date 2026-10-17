import { useAtomValue } from 'jotai';
import { publicWitnessingWriteContextState } from '@states/public_witnessing';

const usePublicWitnessingPermissions = () => {
  const { canManageLocations } = useAtomValue(
    publicWitnessingWriteContextState
  );
  return { canManageLocations };
};

export default usePublicWitnessingPermissions;
