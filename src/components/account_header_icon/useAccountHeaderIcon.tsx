import { useAtomValue } from 'jotai';
import { connectionStatusState, isAppLoadState } from '@states/app';

/**
 * Connection state of the account, for the avatar badge. Red is kept for
 * states only the user can resolve; offline states are neutral.
 */
export const useAccountHeaderIcon = () => {
  const status = useAtomValue(connectionStatusState);
  const isAppLoad = useAtomValue(isAppLoadState);

  return { status: isAppLoad ? 'connected' : status };
};
