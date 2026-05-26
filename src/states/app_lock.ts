import { atom } from 'jotai';

export type AppLockView = 'unlock' | 'forgot' | 'create_new';

export const isAppLockedState = atom(false);

export const appLockViewState = atom<AppLockView>('unlock');

export const appLockWrongAttemptState = atom(false);
