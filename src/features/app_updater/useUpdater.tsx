import { useAtom } from 'jotai';
import { showReloadState } from '@states/app';

const useUpdater = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const [showReload, setShowReload] = useAtom(showReloadState);

  const handleAppUpdated = () => {
    if ('serviceWorker' in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }

    updatePwa();
    setShowReload(false);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  return { handleAppUpdated, showReload };
};

export default useUpdater;
