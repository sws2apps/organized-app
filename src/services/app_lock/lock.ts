import { store } from '@states/index';
import { appLockViewState, isAppLockedState } from '@states/app_lock';

export const appLockLockNow = () => {
  store.set(appLockViewState, 'unlock');
  store.set(isAppLockedState, true);
};
