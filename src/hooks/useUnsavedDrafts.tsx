import { useEffect } from 'react';
import { useStore } from 'jotai';
import { hasUnsavedDraftsState } from '@states/autosave';

const useUnsavedDrafts = () => {
  const store = useStore();
  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!store.get(hasUnsavedDraftsState)) return;

      // the standard way to ask for confirmation before leaving
      event.preventDefault();

      // Chromium before 119 asks only when returnValue is set, and the app
      // runs there too (it needs Chrome 110 at least), so a lost draft is
      // worth keeping the deprecated fallback
      event.returnValue = true; // NOSONAR - S1874: legacy unload prompt
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [store]);
};

export default useUnsavedDrafts;
