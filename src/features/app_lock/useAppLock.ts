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

  // never unlock from the URL: startup completes PIN reset links before load

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

    // timers pause in background tabs, so elapsed time is rechecked on return
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
