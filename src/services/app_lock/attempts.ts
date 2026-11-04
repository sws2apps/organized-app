import { store } from '@states/index';
import { appLockSettingsState } from '@states/app_lock';
import { appLockUpdate } from './storage';

const FREE_ATTEMPTS = 5;

const COOLDOWN_STEPS_MS = [30_000, 60_000, 300_000, 900_000, 3_600_000];

export const appLockRecordFailedAttempt = () => {
  const attempts = store.get(appLockSettingsState).failed_attempts + 1;
  const step = attempts - FREE_ATTEMPTS;

  appLockUpdate({
    failed_attempts: attempts,
    locked_until:
      step >= 0
        ? Date.now() +
          COOLDOWN_STEPS_MS[Math.min(step, COOLDOWN_STEPS_MS.length - 1)]
        : undefined,
  });
};

export const appLockResetAttempts = () => {
  appLockUpdate({ failed_attempts: 0, locked_until: undefined });
};
