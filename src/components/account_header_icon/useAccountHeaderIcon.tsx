import { useAtomValue } from 'jotai';
import { connectionStatusState, isAppLoadState } from '@states/app';

export const useAccountHeaderIcon = () => {
  const status = useAtomValue(connectionStatusState);
  const isAppLoad = useAtomValue(isAppLoadState);

  return { status: isAppLoad ? 'connected' : status };
};
