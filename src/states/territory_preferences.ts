import { atom } from 'jotai';
import type { AssignmentCard } from '@definition/territory';
import { DEFAULT_PROVIDER } from '@features/territories/map/constants';
import type { MapProviderKey } from '@features/territories/map/constants';

// Session preferences stay in the app store and never write congregation data
// or publisher/group names to unencrypted browser storage.
export const territoryCardChoiceState = atom<AssignmentCard | undefined>(
  'digital'
);
export const territoryHolderChoiceState = atom<{
  mode: 'publisher' | 'group';
  group: string;
}>({ mode: 'publisher', group: '' });
export const territoryMapProviderState = atom<MapProviderKey>(DEFAULT_PROVIDER);
