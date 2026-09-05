import { useEffect } from 'react';
import { useStore } from 'jotai';
import { hasUnsavedDraftsState } from '@states/autosave';

const useUnsavedDrafts = () => {
  const store = useStore();
  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!store.get(hasUnsavedDraftsState)) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [store]);
};

export default useUnsavedDrafts;
