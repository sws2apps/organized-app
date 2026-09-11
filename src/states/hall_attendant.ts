import { atom } from 'jotai';
import { HallInfo } from '@definition/hall_attendant';
import { settingsState, userDataViewState } from '@states/settings';
import { updateHallInfo } from '@services/app/hall_attendant';
import { emptyHallInfo } from '@utils/hall_info';
import { autosaveDraftsState } from '@states/autosave';

export const hallInfoState = atom((get) => {
  const view = get(userDataViewState);
  return (
    get(settingsState).cong_settings.hall_attendant_info?.find(
      (row) => row.type === view
    ) ?? emptyHallInfo(view)
  );
});
export const hallInfoUpdateState = atom(
  null,
  (_get, _set, update: (info: HallInfo, timestamp: string) => void) =>
    updateHallInfo(update)
);

export const hallInfoDiscardDraftsState = atom(
  null,
  (_get, set, keys: string[], scope: string, view: string) => {
    set(autosaveDraftsState, (current) => {
      const next = { ...current };
      for (const key of keys) {
        delete next[
          JSON.stringify([scope, JSON.stringify(['hall-info', view, key])])
        ];
      }
      return next;
    });
  }
);
