/*
This file holds the source of the truth for congregation territories.
*/
import { atom } from 'jotai';
import {
  DEFAULT_CATEGORIES,
  Territory,
  TerritoryCategoryOption,
} from '@definition/territory';
import { TerritoryBoundary } from '@definition/territory';
import {
  CONGREGATION_BOUNDARY,
  TERRITORIES,
} from '@features/territories/mockData';
import {
  withAssignments,
  withDerivedStatus,
} from '@features/territories/helpers';
import { monthShortNamesState } from './app';

export const territoriesState = atom<Territory[]>(TERRITORIES);

export const territoryCategoriesState =
  atom<TerritoryCategoryOption[]>(DEFAULT_CATEGORIES);

// the outer border of everything the congregation covers
export const congregationBoundaryState = atom<TerritoryBoundary | undefined>(
  CONGREGATION_BOUNDARY
);

export const territoriesShowHouseholdsState = atom(true);

// months a publisher may hold a territory before it counts as overdue
export const territoryOverdueMonthsState = atom(4);

export const territoriesWithStatusState = atom((get) =>
  withDerivedStatus(
    get(territoriesState).map((territory) =>
      withAssignments(territory, territory.assignments)
    ),
    get(territoryOverdueMonthsState)
  )
);

export const territoryMonthsState = atom((get) => {
  const months = get(monthShortNamesState);

  return [...months.slice(8), ...months.slice(0, 8)];
});
