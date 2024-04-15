import { useRecoilValue } from 'recoil';
import { congAccountConnectedState, isAppLoadState } from '@states/app';
import { avatarUrlState } from '@states/settings';

export const useAccountHeaderIcon = () => {
  const userAvatar = useRecoilValue(avatarUrlState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const isAppLoad = useRecoilValue(isAppLoadState);

  const isOffline = isAppLoad ? false : !congAccountConnected;

  return { userAvatar, isOffline };
};
