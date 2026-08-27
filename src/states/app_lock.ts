import { atom } from 'jotai';

export type AppLockView = 'unlock' | 'forgot';

export const isAppLockedState = atom(false);

export const appLockViewState = atom<AppLockView>('unlock');

export const appLockWrongAttemptState = atom(false);

export const appLockCreatePinState = atom(false);
