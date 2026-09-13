import { useEffect, useLayoutEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { isAppLoadState } from '@states/app';
import {
  appLockAfterMinutesState,
  appLockEnabledState,
} from '@states/settings';
import { appLockViewState, isAppLockedState } from '@states/app_lock';

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
] as const;

const useAppLock = () => {
  const isAppLoad = useAtomValue(isAppLoadState);
  const enabled = useAtomValue(appLockEnabledState);
  const lockAfterMinutes = useAtomValue(appLockAfterMinutesState);

  const isLocked = useAtomValue(isAppLockedState);
  const setIsLocked = useSetAtom(isAppLockedState);
  const setView = useSetAtom(appLockViewState);

  // no URL can lift the lock: a sign-in link that resets a forgotten PIN is
  // completed by the startup screen, which holds the app unloaded (and so
  // unlocked) until the link is verified and the PIN removed

  const coldStartGate = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    if (isAppLoad) {
      coldStartGate.current = false;
      setIsLocked(false);
      return;
    }

    if (!enabled) {
      coldStartGate.current = false;
      setIsLocked(false);
      return;
    }

    if (!coldStartGate.current) {
      coldStartGate.current = true;
      setView('unlock');
      setIsLocked(true);
    }
  }, [isAppLoad, enabled, setIsLocked, setView]);

  useEffect(() => {
    if (!enabled || isLocked || isAppLoad) return;
    if (lockAfterMinutes < 0) return;

    const lockAfterMs = Math.max(0, lockAfterMinutes) * 60_000;

    const lockNow = () => {
      setView('unlock');
      setIsLocked(true);
    };

    if (lockAfterMs === 0) {
      lockNow();
      return;
    }

    // a timer is throttled or frozen in a background tab, so the time since
    // the last activity is kept too and checked when the app comes back
    let lastActivity = Date.now();

    const schedule = (delay: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(lockNow, delay);
    };

    const resetTimer = () => {
      lastActivity = Date.now();
      schedule(lockAfterMs);
    };

    const checkElapsed = () => {
      if (document.visibilityState === 'hidden') return;

      const remaining = lockAfterMs - (Date.now() - lastActivity);

      if (remaining <= 0) {
        lockNow();
        return;
      }

      schedule(remaining);
    };

    resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      globalThis.addEventListener(event, resetTimer, { passive: true });
    }

    document.addEventListener('visibilitychange', checkElapsed);
    globalThis.addEventListener('focus', checkElapsed);
    globalThis.addEventListener('pageshow', checkElapsed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        globalThis.removeEventListener(event, resetTimer);
      }
      document.removeEventListener('visibilitychange', checkElapsed);
      globalThis.removeEventListener('focus', checkElapsed);
      globalThis.removeEventListener('pageshow', checkElapsed);
    };
  }, [enabled, isLocked, isAppLoad, lockAfterMinutes, setIsLocked, setView]);
};

export default useAppLock;
