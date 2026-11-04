import { atom } from 'jotai';
import type { TerritorySyncStatus } from '@definition/territory_sync';
export const territorySyncStatusState = atom<TerritorySyncStatus>('idle');
export const territorySyncPendingState = atom(0);
