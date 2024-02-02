import { useRecoilValue } from 'recoil';
import { isOnlineState } from '@states/app';
import { avatarUrlState } from '@states/settings';

export const useAccountHeaderIcon = () => {
  const userAvatar = useRecoilValue(avatarUrlState);
  const isOnline = useRecoilValue(isOnlineState);

  return { userAvatar, isOnline };
};
