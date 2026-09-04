import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
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
  const [searchParams] = useSearchParams();

  const isAppLoad = useAtomValue(isAppLoadState);
  const enabled = useAtomValue(appLockEnabledState);
  const lockAfterMinutes = useAtomValue(appLockAfterMinutesState);

  const isLocked = useAtomValue(isAppLockedState);
  const setIsLocked = useSetAtom(isAppLockedState);
  const setView = useSetAtom(appLockViewState);

  // the forgot-PIN flow returns through the passwordless link: locking the app
  // then would send the user straight back to the PIN they cannot remember
  const isEmailLinkAuth = searchParams.get('code') !== null;

  const coldStartGate = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    if (isAppLoad) {
      coldStartGate.current = false;
      setIsLocked(false);
      return;
    }

    if (!enabled || isEmailLinkAuth) {
      coldStartGate.current = false;
      setIsLocked(false);
      return;
    }

    if (!coldStartGate.current) {
      coldStartGate.current = true;
      setView('unlock');
      setIsLocked(true);
    }
  }, [isAppLoad, enabled, isEmailLinkAuth, setIsLocked, setView]);

  useEffect(() => {
    if (!enabled || isLocked || isAppLoad || isEmailLinkAuth) return;
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
      globalThis.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        globalThis.removeEventListener(event, resetTimer);
      }
    };
  }, [
    enabled,
    isLocked,
    isAppLoad,
    isEmailLinkAuth,
    lockAfterMinutes,
    setIsLocked,
    setView,
  ]);
};

export default useAppLock;
