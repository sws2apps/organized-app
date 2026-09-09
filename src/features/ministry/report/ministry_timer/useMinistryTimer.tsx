import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { addMonths, formatDate } from '@utils/date';
import {
  reportUserSelectedMonthState,
  userMinistryTimerState,
} from '@states/user_field_service_reports';
import {
  fieldServiceTimeFromSeconds,
  handleAddFieldServiceTime,
} from '@services/app/user_field_service_reports';
import { userLocalUIDState } from '@states/settings';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import useAppTranslation from '@hooks/useAppTranslation';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useMinistryTimer = () => {
  const { t } = useAppTranslation();

  const [timer, setTimer] = useAtom(userMinistryTimerState);

  const setSelectedMonth = useSetAtom(reportUserSelectedMonthState);

  const userUID = useAtomValue(userLocalUIDState);

  const [, refreshTimer] = useReducer((value: number) => value + 1, 0);

  // the last moment the running session was seen, to notice a clock moved back
  const lastSeen = useRef(Date.now());

  // a stop already being written must not be started a second time
  const stopping = useRef(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDate, setEditorDate] = useState('');
  const [sliderOpen, setSliderOpen] = useState(false);

  const timerState = timer.state;

  /**
   * Elapsed seconds of the current session, always derived from the moment the
   * timer was started so that a throttled or suspended tab cannot lose time.
   */
  const getElapsedTime = useCallback(() => {
    if (timer.state !== 'started') return timer.value;

    const additionalTime = Math.max(
      0,
      Math.floor((Date.now() - timer.start) / 1000)
    );

    return timer.value + additionalTime;
  }, [timer]);

  const time = getElapsedTime();

  /**
   * The day a session is reported on is the day it started, so that a session
   * running past midnight stays in the month the publisher went out. The day is
   * kept in the timer record, and a record saved before the day was stored
   * falls back to the start of its running segment.
   */
  const sessionDate = formatDate(
    new Date(
      timer.state === 'not_started'
        ? Date.now()
        : timer.date || timer.start || Date.now()
    ),
    'yyyy/MM/dd'
  );

  const month = sessionDate.slice(0, 7);

  const { read_only } = useMinistryMonthlyRecord({
    month,
    person_uid: userUID,
    publisher: true,
  });

  const report_date = useMemo(() => {
    if (!read_only) {
      return sessionDate;
    }

    return formatDate(addMonths(sessionDate, 1), 'yyyy/MM/01');
  }, [read_only, sessionDate]);

  const resetTimer = useCallback(() => {
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = 0;
      newValue.date = 0;
      newValue.state = 'not_started';
      newValue.value = 0;

      return newValue;
    });
  }, [setTimer]);

  const handleStart = () => {
    lastSeen.current = Date.now();

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.date = prev.date || Date.now();
      newValue.state = 'started';

      return newValue;
    });
  };

  const handlePause = () => {
    const elapsed = getElapsedTime();

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.state = 'paused';
      newValue.value = elapsed;

      return newValue;
    });
  };

  const handleAddTime = () => {
    setSelectedMonth(report_date.slice(0, 7));
    setEditorDate(report_date);
    setEditorOpen(true);
  };

  const handleStop = async () => {
    // a stop already being written must not be repeated by a second tap
    if (stopping.current) return;

    const elapsed = getElapsedTime();

    const { hours, minutes } = fieldServiceTimeFromSeconds(elapsed);

    if (hours === 0 && minutes === 0) {
      resetTimer();

      displaySnackNotification({
        header: t('tr_timerNothingToSave'),
        message: t('tr_timerNothingToSaveDesc'),
        severity: 'error',
      });

      return;
    }

    stopping.current = true;

    // the measured time is held while it is written, so that a save that fails
    // leaves a session to stop again instead of an erased one
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.state = 'paused';
      newValue.value = elapsed;

      return newValue;
    });

    try {
      const report = await handleAddFieldServiceTime(report_date, elapsed);

      resetTimer();

      setSelectedMonth(report.report_date.slice(0, 7));
      setEditorDate(report.report_date);
      setEditorOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(message),
        severity: 'error',
      });
    } finally {
      stopping.current = false;
    }
  };

  const handleLeftButtonAction = async () => {
    if (timerState === 'started' || timerState === 'paused') {
      await handleStop();
    }

    if (timerState === 'not_started') {
      handleAddTime();
    }
  };

  const handleRightButtonAction = () => {
    if (timerState === 'not_started' || timerState === 'paused') {
      handleStart();
    }

    if (timerState === 'started') {
      handlePause();
    }
  };

  const handleCloseEditor = () => setEditorOpen(false);

  const handleOpenSlider = () => {
    setSliderOpen(true);
  };

  const handleCloseSlider = () => setSliderOpen(false);

  const handleTimeAdded = (value: number) => {
    lastSeen.current = Date.now();

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.date = prev.date || Date.now();
      newValue.state = 'started';
      newValue.value = value;

      return newValue;
    });
  };

  /**
   * Keeps what a running session has already measured when the device clock is
   * corrected backwards, by banking the time up to the last moment the session
   * was seen and counting again from the corrected clock.
   */
  const syncClock = useCallback(() => {
    const now = Date.now();

    if (now < lastSeen.current) {
      setTimer((prev) => {
        if (prev.state !== 'started') return prev;

        const newValue = structuredClone(prev);
        newValue.value =
          prev.value +
          Math.max(0, Math.floor((lastSeen.current - prev.start) / 1000));
        newValue.start = now;

        return newValue;
      });
    }

    lastSeen.current = now;

    refreshTimer();
  }, [setTimer]);

  // repaint the elapsed time while a session is running
  useEffect(() => {
    if (timerState !== 'started') return;

    lastSeen.current = Date.now();

    const interval = setInterval(syncClock, 1000);

    return () => clearInterval(interval);
  }, [timerState, syncClock]);

  // repaint as soon as the app is brought back to the foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncClock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', syncClock);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', syncClock);
    };
  }, [syncClock]);

  return {
    handleRightButtonAction,
    timerState,
    handleLeftButtonAction,
    today: sessionDate,
    editorOpen,
    editorDate,
    handleCloseEditor,
    sliderOpen,
    handleOpenSlider,
    handleCloseSlider,
    handleTimeAdded,
    time,
  };
};

export default useMinistryTimer;
