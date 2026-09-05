import { useCallback } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { AutosaveDraft } from '@definition/autosave';
import { autosaveDraftsState, autosaveScopeState } from '@states/autosave';

const EMPTY_DRAFTS: Record<string, AutosaveDraft> = {};

const useAutosaveDrafts = (record: string) => {
  const store = useStore();
  const scope = useAtomValue(autosaveScopeState);
  const key = JSON.stringify([scope, record]);
  const allDrafts = useAtomValue(autosaveDraftsState);
  const drafts = allDrafts[key] ?? EMPTY_DRAFTS;
  const getDrafts = useCallback(
    () => store.get(autosaveDraftsState)[key] ?? EMPTY_DRAFTS,
    [store, key]
  );
  const isCurrentScope = useCallback(
    () => store.get(autosaveScopeState) === scope,
    [store, scope]
  );
  const updateDrafts = useCallback(
    (
      update: (
        current: Record<string, AutosaveDraft>
      ) => Record<string, AutosaveDraft>
    ) => {
      store.set(autosaveDraftsState, (current) => {
        const previous = current[key] ?? EMPTY_DRAFTS;
        const next = update(previous);
        if (next === previous) return current;
        const result = { ...current };
        if (Object.keys(next).length) result[key] = next;
        else delete result[key];
        return result;
      });
    },
    [store, key]
  );
  return { key, drafts, getDrafts, updateDrafts, isCurrentScope };
};

export default useAutosaveDrafts;
