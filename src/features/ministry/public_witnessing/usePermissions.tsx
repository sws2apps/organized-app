import { useAtomValue } from 'jotai';
import { publicWitnessingWriteContextState } from '@states/public_witnessing';

const usePublicWitnessingPermissions = () => {
  const { canManageLocations, userUID } = useAtomValue(
    publicWitnessingWriteContextState
  );
  return { canManageLocations, userUID };
};

export default usePublicWitnessingPermissions;
