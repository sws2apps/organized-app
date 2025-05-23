import { useAtomValue } from 'jotai';
import { congAccountConnectedState, isAppLoadState } from '@states/app';
import { userAvatarUrlState } from '@states/settings';

/**
 * Custom hook for managing the user's avatar and offline status.
 * @returns {Object} Object containing userAvatar and isOffline properties
 */
export const useAccountHeaderIcon = () => {
  const userAvatar = useAtomValue(userAvatarUrlState);
  const congAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);

  const isOffline = isAppLoad ? false : !congAccountConnected;

  return { userAvatar, isOffline };
};
