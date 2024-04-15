import { useRecoilValue } from 'recoil';
import { showReloadState } from '@states/app';

const useUpdater = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const showReload = useRecoilValue(showReloadState);

  const handleAppUpdated = () => {
    updatePwa();
    window.location.reload();
  };

  return { handleAppUpdated, showReload };
};

export default useUpdater;
