import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  reportUserSelectedMonthState,
  userMinistryTimerState,
} from '@states/user_field_service_reports';
import {
  fieldServiceTimeFromSeconds,
  handleAddFieldServiceTime,
  ministryTimerCorrectClock,
  ministryTimerElapsed,
  ministryTimerReportDate,
  ministryTimerSessionDate,
  userFieldServiceMonthConfirmed,
} from '@services/app/user_field_service_reports';
import { userLocalUIDState } from '@states/settings';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { personsActiveState } from '@states/persons';
import usePerson from '@features/persons/hooks/usePerson';
import useAppTranslation from '@hooks/useAppTranslation';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useMinistryTimer = () => {
  const { t } = useAppTranslation();

  const [timer, setTimer] = useAtom(userMinistryTimerState);

  const setSelectedMonth = useSetAtom(reportUserSelectedMonthState);

  const userUID = useAtomValue(userLocalUIDState);
  const congReports = useAtomValue(congFieldServiceReportsState);
  const persons = useAtomValue(personsActiveState);

  const { personIsPublisher } = usePerson();

  const [, refreshTimer] = useReducer((value: number) => value + 1, 0);

  // the last moment the running session was seen, to notice a clock moved back
  const lastSeen = useRef(Date.now());

  // a stop being written holds the timer, so nothing can start a session that
  // the finished save would then reset
  const stopping = useRef(false);
  const [saving, setSaving] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDate, setEditorDate] = useState('');
  const [sliderOpen, setSliderOpen] = useState(false);
  const [rollDigits, setRollDigits] = useState(true);

  const timerState = timer.state;

  const time = ministryTimerElapsed(timer, Date.now());

  const sessionDate = ministryTimerSessionDate(timer, Date.now());

  const isMonthLocked = useCallback(
    (month: string) => {
      const person = persons.find((record) => record.person_uid === userUID);

      if (!person || !personIsPublisher(person, month)) return true;

      return userFieldServiceMonthConfirmed(congReports, userUID, month);
    },
    [persons, userUID, personIsPublisher, congReports]
  );

  const report_date = useMemo(
    () => ministryTimerReportDate(sessionDate, isMonthLocked),
    [sessionDate, isMonthLocked]
  );

  /**
   * The running session as of now, with a clock moved back since it was last
   * seen already corrected, so that pausing or stopping never measures less
   * than was shown.
   */
  const getCurrentTimer = () => {
    const now = Date.now();

    const current = ministryTimerCorrectClock(timer, lastSeen.current, now);

    lastSeen.current = now;

    return { current, elapsed: ministryTimerElapsed(current, now) };
  };

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

    setRollDigits(false);

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.date = prev.date || Date.now();
      newValue.state = 'started';

      return newValue;
    });
  };

  const handlePause = () => {
    const { current, elapsed } = getCurrentTimer();

    const newValue = structuredClone(current);
    newValue.state = 'paused';
    newValue.value = elapsed;

    setTimer(newValue);
  };

  const handleAddTime = () => {
    const date = report_date ?? sessionDate;

    setSelectedMonth(date.slice(0, 7));
    setEditorDate(date);
    setEditorOpen(true);
  };

  const handleStop = async () => {
    if (stopping.current) return;

    const { current, elapsed } = getCurrentTimer();

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

    if (!report_date) {
      handlePause();

      displaySnackNotification({
        header: t('tr_timerNoOpenMonth'),
        message: t('tr_timerNoOpenMonthDesc'),
        severity: 'error',
      });

      return;
    }

    stopping.current = true;
    setSaving(true);

    // the measured time is held while it is written, so that a save that fails
    // leaves a session to stop again instead of an erased one
    const pausedTimer = structuredClone(current);
    pausedTimer.state = 'paused';
    pausedTimer.value = elapsed;

    setTimer(pausedTimer);

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
      setSaving(false);
    }
  };

  const handleLeftButtonAction = async () => {
    if (stopping.current) return;

    if (timerState === 'started' || timerState === 'paused') {
      await handleStop();
    }

    if (timerState === 'not_started') {
      handleAddTime();
    }
  };

  const handleRightButtonAction = () => {
    if (stopping.current) return;

    if (timerState === 'not_started' || timerState === 'paused') {
      handleStart();
    }

    if (timerState === 'started') {
      handlePause();
    }
  };

  const handleCloseEditor = () => setEditorOpen(false);

  const handleOpenSlider = () => {
    if (stopping.current) return;

    setSliderOpen(true);
  };

  const handleCloseSlider = () => setSliderOpen(false);

  const handleTimeAdded = (value: number) => {
    if (stopping.current) return;

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

  // corrects a clock moved back and repaints the running session
  const syncClock = useCallback(() => {
    const now = Date.now();
    const seen = lastSeen.current;

    setTimer((prev) => ministryTimerCorrectClock(prev, seen, now));

    lastSeen.current = now;

    setRollDigits(true);

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
    saving,
    today: sessionDate,
    editorOpen,
    editorDate,
    handleCloseEditor,
    sliderOpen,
    handleOpenSlider,
    handleCloseSlider,
    handleTimeAdded,
    time,
    rollDigits,
  };
};

export default useMinistryTimer;
