import { useEffect } from 'react';
import { useStore } from 'jotai';
import { hasUnsavedDraftsState } from '@states/autosave';

const useUnsavedDrafts = () => {
  const store = useStore();
  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!store.get(hasUnsavedDraftsState)) return;

      // every engine the esnext build runs on asks for confirmation on this
      // alone, so the deprecated returnValue is not needed
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [store]);
};

export default useUnsavedDrafts;
