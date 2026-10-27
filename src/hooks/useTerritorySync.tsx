import {
  TERRITORY_SYNC_REFRESH_INTERVAL,
  TERRITORY_SYNC_DEBOUNCE,
} from '@constants/index';
import {
  territorySharedSettingsState,
  DEFAULT_TERRITORY_SHARED_SETTINGS,
} from '@states/territories';
import { userIDState, isOnlineState } from '@states/app';
import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useLiveQuery } from 'dexie-react-hooks';
import { dbTerritorySyncGet } from '@services/dexie/territory_sync';
import { synchronizeTerritories } from '@services/app/territory_sync';
import { territorySyncPendingState } from '@states/territory_sync';
import { congIDState, congDataSyncState } from '@states/settings';

const useTerritorySync = () => {
  const congregation = useAtomValue(congIDState);
  const user = useAtomValue(userIDState);
  const setSettings = useSetAtom(territorySharedSettingsState);
  const enabled = useAtomValue(congDataSyncState);
  const online = useAtomValue(isOnlineState);
  const state = useLiveQuery(dbTerritorySyncGet);
  const setPending = useSetAtom(territorySyncPendingState);
  useEffect(() => {
    setSettings(DEFAULT_TERRITORY_SHARED_SETTINGS);
  }, [congregation, user, setSettings]);
  useEffect(() => {
    if (state?.scope === `${congregation}:${user}` && state.settings)
      setSettings(state.settings);
  }, [state, congregation, user, setSettings]);
  useEffect(() => {
    setPending(
      state?.scope === `${congregation}:${user}`
        ? state.queue.length + Number(!!state.settingsDirty)
        : 0
    );
  }, [state, setPending, congregation, user]);
  useEffect(() => {
    if (!enabled || !online) return;
    const refresh = () => {
      if (document.visibilityState === 'visible') void synchronizeTerritories();
    };
    const timer = window.setTimeout(refresh, TERRITORY_SYNC_DEBOUNCE);
    const interval = window.setInterval(() => {
      if (
        state?.queue.length ||
        state?.settingsDirty ||
        window.location.hash.includes('/territories')
      )
        refresh();
    }, TERRITORY_SYNC_REFRESH_INTERVAL);
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [
    congregation,
    user,
    enabled,
    online,
    state?.queue.length,
    state?.settingsDirty,
  ]);
};
export default useTerritorySync;
