import { useEffect, useLayoutEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { isAppLoadState } from '@states/app';
import {
  appLockAfterMinutesState,
  appLockEnabledState,
} from '@states/settings';
import { isAppLockedState, appLockViewState } from '@states/app_lock';

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

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(lockNow, lockAfterMs);
    };

    resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [enabled, isLocked, isAppLoad, lockAfterMinutes, setIsLocked, setView]);
};

export default useAppLock;
