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
