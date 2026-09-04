import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { addMonths, formatDate } from '@utils/date';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
  userMinistryTimerState,
} from '@states/user_field_service_reports';
import { handleSaveDailyFieldServiceReport } from '@services/app/user_field_service_reports';
import { userLocalUIDState } from '@states/settings';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { userFieldServiceDailyReportSchema } from '@services/dexie/schema';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import useAppTranslation from '@hooks/useAppTranslation';
import { displaySnackNotification } from '@services/states/app';

const useMinistryTimer = () => {
  const { t } = useAppTranslation();

  const [timer, setTimer] = useAtom(userMinistryTimerState);

  const setSelectedMonth = useSetAtom(reportUserSelectedMonthState);

  const reports = useAtomValue(userFieldServiceDailyReportsState);
  const userUID = useAtomValue(userLocalUIDState);

  const [, refreshTimer] = useReducer((value: number) => value + 1, 0);

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

  const currentReport = useMemo(() => {
    return reports.find((record) => record.report_date === report_date);
  }, [reports, report_date]);

  const handleStart = () => {
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
    const elapsed = getElapsedTime();

    const elapsedHours = Math.floor(elapsed / 3600);
    const elapsedMinutes = Math.round((elapsed - elapsedHours * 3600) / 60);

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = 0;
      newValue.date = 0;
      newValue.state = 'not_started';
      newValue.value = 0;

      return newValue;
    });

    if (elapsedHours > 0 || elapsedMinutes > 0) {
      let draftReport: UserFieldServiceDailyReportType;

      if (currentReport) {
        draftReport = structuredClone(currentReport);
      } else {
        draftReport = structuredClone(userFieldServiceDailyReportSchema);
        draftReport.report_date = report_date;
      }

      const current = draftReport.report_data.hours.field_service;
      const [prevHours, prevMinutes] = current.split(':').map(Number);

      let newHours = (prevHours || 0) + elapsedHours;
      let newMinutes = (prevMinutes || 0) + elapsedMinutes;

      if (newMinutes >= 60) {
        newHours++;
        newMinutes = newMinutes - 60;
      }

      draftReport.report_data.hours.field_service = `${newHours}:${String(newMinutes).padStart(2, '0')}`;
      draftReport.report_data._deleted = false;
      draftReport.report_data.updatedAt = new Date().toISOString();

      await handleSaveDailyFieldServiceReport(draftReport);

      setSelectedMonth(draftReport.report_date.slice(0, 7));
      setEditorDate(draftReport.report_date);
      setEditorOpen(true);

      return;
    }

    displaySnackNotification({
      header: t('tr_timerNothingToSave'),
      message: t('tr_timerNothingToSaveDesc'),
      severity: 'error',
    });
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
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.date = prev.date || Date.now();
      newValue.state = 'started';
      newValue.value = value;

      return newValue;
    });
  };

  // repaint the elapsed time while a session is running
  useEffect(() => {
    if (timerState !== 'started') return;

    const interval = setInterval(refreshTimer, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  // repaint as soon as the app is brought back to the foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', refreshTimer);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', refreshTimer);
    };
  }, []);

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
