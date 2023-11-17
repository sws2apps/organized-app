import { useRecoilValue } from 'recoil';
import { showReloadState } from '@states/app';

const useUpdater = ({ updatePwa }) => {
  const showReload = useRecoilValue(showReloadState);

  const handleAppUpdated = () => {
    updatePwa();
    window.location.reload();
  };

  return { handleAppUpdated, showReload };
};

export default useUpdater;
