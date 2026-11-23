import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  appLockEnabledState,
  appLockSettingsState,
  isAppLockedState,
} from '@states/app_lock';
import { STORAGE_KEY } from '@constants/index';
import { appLockLockNow } from '@services/app_lock/lock';
import { appLockRefresh } from '@services/app_lock/storage';

const ACTIVITY_EVENTS = [
  'pointerdown',
  'pointermove',
  'keydown',
  'wheel',
  'scroll',
  'touchstart',
] as const;

const useAppLock = () => {
  const enabled = useAtomValue(appLockEnabledState);
  const { lock_after_minutes } = useAtomValue(appLockSettingsState);
  const isLocked = useAtomValue(isAppLockedState);
  const setIsLocked = useSetAtom(isAppLockedState);

  // e.g. the PIN was reset or turned off in another tab
  useEffect(() => {
    if (!enabled) setIsLocked(false);
  }, [enabled, setIsLocked]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY.app_lock) appLockRefresh();
    };

    globalThis.addEventListener('storage', handleStorage);

    return () => globalThis.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!enabled || isLocked || lock_after_minutes < 0) return;

    const timeout = lock_after_minutes * 60_000;

    let lastActivity = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    // activity only stamps the time, the timer checks it when it fires
    const check = () => {
      const remaining = timeout - (Date.now() - lastActivity);

      if (remaining <= 0) appLockLockNow();
      else timer = setTimeout(check, remaining);
    };

    const markActive = () => {
      lastActivity = Date.now();
    };

    // background tabs pause timers, so the time away counts on return
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;

      clearTimeout(timer);
      check();
    };

    timer = setTimeout(check, timeout);

    for (const event of ACTIVITY_EVENTS) {
      globalThis.addEventListener(event, markActive, { passive: true });
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);

      for (const event of ACTIVITY_EVENTS) {
        globalThis.removeEventListener(event, markActive);
      }

      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, isLocked, lock_after_minutes]);
};

export default useAppLock;
