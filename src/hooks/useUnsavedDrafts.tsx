import { useEffect } from 'react';
import { useStore } from 'jotai';
import { hasUnsavedDraftsState } from '@states/autosave';

const useUnsavedDrafts = () => {
  const store = useStore();
  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!store.get(hasUnsavedDraftsState)) return;
      event.preventDefault();

      // deprecated, but older engines still ask for the confirmation only
      // when it is set, and a lost draft costs more than a warning
      event.returnValue = true;
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [store]);
};

export default useUnsavedDrafts;
