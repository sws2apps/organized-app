import { useAtomValue } from 'jotai';
import { congAccountConnectedState, isAppLoadState } from '@states/app';

/**
 * Custom hook for managing the user's offline status.
 * @returns {Object} Object containing isOffline property
 */
export const useAccountHeaderIcon = () => {
  const congAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);

  const isOffline = isAppLoad ? false : !congAccountConnected;

  return { isOffline };
};
