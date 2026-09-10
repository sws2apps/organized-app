import { useEffect } from 'react';
import { useStore } from 'jotai';
import { hasUnsavedDraftsState } from '@states/autosave';

const useUnsavedDrafts = () => {
  const store = useStore();
  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!store.get(hasUnsavedDraftsState)) return;
      // preventDefault is what asks for the confirmation now; returnValue is
      // deprecated and no longer needed by the browsers the app supports
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [store]);
};

export default useUnsavedDrafts;
