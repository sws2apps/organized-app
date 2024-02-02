import { useRecoilValue } from 'recoil';
import { isOnlineState } from '@states/app';
import { avatarUrlState } from '@states/settings';

export const useAccountHeaderIcon = () => {
  const userAvatar: string = useRecoilValue(avatarUrlState);
  const isOnline: boolean = useRecoilValue(isOnlineState);

  return { userAvatar, isOnline };
};
