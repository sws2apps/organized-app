import { atom } from 'jotai';
import { AutosaveDraft } from '@definition/autosave';
import { congIDState, userLocalUIDState } from '@states/settings';

export const autosaveScopeState = atom((get) =>
  JSON.stringify([get(congIDState), get(userLocalUIDState)])
);

export const autosaveDraftsState = atom<
  Record<string, Record<string, AutosaveDraft>>
>({});

export const hasUnsavedDraftsState = atom((get) => {
  const scope = get(autosaveScopeState);
  return Object.entries(get(autosaveDraftsState)).some(([key, record]) => {
    const [draftScope] = JSON.parse(key) as [string, string];
    return (
      draftScope === scope &&
      Object.values(record).some((draft) => draft.status !== 'saved')
    );
  });
});
