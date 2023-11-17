import { useRecoilValue } from 'recoil';
import { isPrecachedState, showReloadState } from '@states/app';
import { setIsPrecached } from '@services/recoil/app';

const useUpdater = ({ updatePwa }) => {
  const showReload = useRecoilValue(showReloadState);
  const isPrecached = useRecoilValue(isPrecachedState);

  const handleAppCached = async () => {
    await setIsPrecached();
  };

  const handleAppUpdated = () => {
    updatePwa();
    window.location.reload();
  };

  return { handleAppUpdated, handleAppCached, showReload, isPrecached };
};

export default useUpdater;
