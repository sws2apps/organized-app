import { useAtom } from 'jotai';
import { showReloadState } from '@states/app';

const useUpdater = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const [showReload, setShowReload] = useAtom(showReloadState);

  const handleAppUpdated = () => {
    updatePwa();
    setShowReload(false);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return { handleAppUpdated, showReload };
};

export default useUpdater;
