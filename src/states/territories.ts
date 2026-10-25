import type { TerritoryServerAccess } from '@definition/territory_access';
import { isTest } from '@constants/index';
import type { TerritorySharedSettings } from '@definition/territory_sync';
import {
  saveTerritoryChanges,
  saveTerritorySettings,
} from '@services/app/territories';
import { displaySnackNotification } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';
import { congIDState, userDataViewState } from '@states/settings';
import { userIDState } from '@states/app';

/*
This file holds the source of the truth for congregation territories.
*/
import { atom } from 'jotai';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_RECOMMENDATIONS,
  Territory,
} from '@definition/territory';
import { CONGREGATION_BOUNDARY } from '@features/territories/mockData';
import {
  withAssignments,
  withDerivedStatus,
} from '@features/territories/helpers';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { monthShortNamesState } from './app';

export const territoryServerAccessState = atom<
  TerritoryServerAccess | undefined
>();

export const territoriesDbState = atom<Territory[]>([]);

export const territoryWritesPendingState = atom(0);
export const territoryLoadedScopeState = atom('');
export const territoryLoadedViewState = atom<string | null>(null);

export const territoriesState = atom(
  (get) =>
    get(territoryLoadedViewState) === get(userDataViewState) &&
    (isTest ||
      get(territoryLoadedScopeState) ===
        `${get(congIDState)}:${get(userIDState)}`)
      ? get(territoriesDbState)
      : [],
  async (
    get,
    set,
    update: Territory[] | ((previous: Territory[]) => Territory[])
  ) => {
    if (get(territoryLoadedViewState) !== get(userDataViewState)) return;
    const previous = get(territoriesDbState);
    const next = typeof update === 'function' ? update(previous) : update;
    const dataView = get(userDataViewState);
    set(territoryWritesPendingState, (count) => count + 1);
    set(territoriesDbState, next);
    try {
      await saveTerritoryChanges(previous, next, dataView);
    } catch {
      if (get(territoriesDbState) === next) set(territoriesDbState, previous);
      displaySnackNotification({
        severity: 'error',
        header: getTranslation({ key: 'error_app_generic-title' }),
        message: getTranslation({ key: 'tr_territorySaveFailed' }),
      });
    } finally {
      set(territoryWritesPendingState, (count) => count - 1);
    }
  }
);

export const DEFAULT_TERRITORY_SHARED_SETTINGS: TerritorySharedSettings = {
  categories: DEFAULT_CATEGORIES,
  boundary: isTest ? CONGREGATION_BOUNDARY : undefined,
  borderColor: 'red',
  borderDashed: false,
  recommendations: DEFAULT_RECOMMENDATIONS,
  overdueMonths: 4,
};
export const territorySharedSettingsState = atom<TerritorySharedSettings>(
  DEFAULT_TERRITORY_SHARED_SETTINGS
);

const sharedSetting = <K extends keyof TerritorySharedSettings>(key: K) =>
  atom(
    (get) => get(territorySharedSettingsState)[key],
    async (
      get,
      set,
      update:
        | TerritorySharedSettings[K]
        | ((previous: TerritorySharedSettings[K]) => TerritorySharedSettings[K])
    ) => {
      const previous = get(territorySharedSettingsState);
      const value =
        typeof update === 'function' ? update(previous[key]) : update;
      const next = { ...previous, [key]: value };
      set(territorySharedSettingsState, next);
      try {
        await saveTerritorySettings(next, previous);
      } catch {
        if (get(territorySharedSettingsState) === next)
          set(territorySharedSettingsState, previous);
        displaySnackNotification({
          severity: 'error',
          header: getTranslation({ key: 'error_app_generic-title' }),
          message: getTranslation({ key: 'tr_territorySaveFailed' }),
        });
      }
    }
  );
export const territoryCategoriesState = sharedSetting('categories');
export const congregationBoundaryState = sharedSetting('boundary');
export const congregationBorderColorState = sharedSetting('borderColor');
export const congregationBorderDashedState = sharedSetting('borderDashed');
export const territoryRecommendationsState = sharedSetting('recommendations');
export const territoryOverdueMonthsState = sharedSetting('overdueMonths');
export const territoriesShowHouseholdsState = atom(true);
export const territoriesShowDoNotCallCountState = atom(true);
export const territoriesShowDoNotCallMapState = atom(true);
export const territoryLocalModeState = atom(false);

export const territoriesWithStatusState = atom((get) =>
  withDerivedStatus(
    get(territoriesState).map((territory) =>
      withAssignments(territory, territory.assignments)
    ),
    get(territoryOverdueMonthsState),
    get(territoryCampaignsState)
  )
);

export const territoryMonthsState = atom((get) => {
  const months = get(monthShortNamesState);

  return [...months.slice(8), ...months.slice(0, 8)];
});
