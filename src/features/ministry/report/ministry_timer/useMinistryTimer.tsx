import { useEffect, useMemo, useRef, useState } from 'react';
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

const useMinistryTimer = () => {
  const timerRef = useRef<NodeJS.Timeout>(null);

  const [timer, setTimer] = useAtom(userMinistryTimerState);

  const setSelectedMonth = useSetAtom(reportUserSelectedMonthState);

  const reports = useAtomValue(userFieldServiceDailyReportsState);
  const userUID = useAtomValue(userLocalUIDState);

  const today = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM/dd');
  }, []);

  const month = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM');
  }, []);

  const { read_only } = useMinistryMonthlyRecord({
    month,
    person_uid: userUID,
    publisher: true,
  });

  const report_date = useMemo(() => {
    if (!read_only) {
      return today;
    }

    return formatDate(addMonths(today, 1), 'yyyy/MM/01');
  }, [read_only, today]);

  const currentReport = useMemo(() => {
    return reports.find((record) => record.report_date === report_date);
  }, [reports, report_date]);

  // restore state from db if timer state left as started
  const initialTime = useMemo(() => {
    if (timer.state === 'started') {
      const now = Date.now();
      const elapsedTime = timer.value;

      const additionalTime = Math.floor((now - timer.start) / 1000);
      return elapsedTime + additionalTime;
    }

    if (timer.state === 'paused') {
      return timer.value;
    }

    return 0;
  }, [timer]);

  const timerState = useMemo(() => {
    return timer.state;
  }, [timer.state]);

  const [time, setTime] = useState(initialTime);
  const [editorOpen, setEditorOpen] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleStart = () => {
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.state = 'started';

      return newValue;
    });
  };

  const handlePause = () => {
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.state = 'paused';
      newValue.value = time;

      return newValue;
    });
  };

  const handleAddTime = () => {
    setSelectedMonth(report_date.slice(0, 7));
    setEditorOpen(true);
  };

  const handleStop = async () => {
    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = 0;
      newValue.state = 'not_started';
      newValue.value = 0;

      return newValue;
    });

    if (hours > 0 || minutes > 0) {
      let draftReport: UserFieldServiceDailyReportType;

      if (!currentReport) {
        draftReport = structuredClone(userFieldServiceDailyReportSchema);
        draftReport.report_date = report_date;
      }

      if (currentReport) {
        draftReport = structuredClone(currentReport);
      }

      const current = draftReport.report_data.hours.field_service;
      const [prevHours, prevMinutes] = current.split(':').map(Number);

      let newHours = prevHours + hours;
      let newMinutes = (prevMinutes || 0) + minutes;

      if (newMinutes >= 60) {
        newHours++;
        newMinutes = newMinutes - 60;
      }

      draftReport.report_data.hours.field_service = `${newHours}:${String(newMinutes).padStart(2, '0')}`;
      draftReport.report_data._deleted = false;
      draftReport.report_data.updatedAt = new Date().toISOString();

      await handleSaveDailyFieldServiceReport(draftReport);

      setSelectedMonth(draftReport.report_date.slice(0, 7));
      setEditorOpen(true);
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
    setTime(value);

    setTimer((prev) => {
      const newValue = structuredClone(prev);
      newValue.start = Date.now();
      newValue.state = 'started';
      newValue.value = value;

      return newValue;
    });
  };

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  // restore state from db on tab active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (timer.state === 'started') {
          const now = Date.now();
          const elapsedTime = timer.value;

          const additionalTime = Math.floor((now - timer.start) / 1000);
          setTime(elapsedTime + additionalTime);
        } else if (timer.state === 'paused') {
          setTime(timer.value);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timer]);

  // launch timer
  useEffect(() => {
    if (timerState === 'started') {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState, time]);

  useEffect(() => {
    if (time > 0) {
      // Convert seconds to hours, minutes, and seconds
      const seconds = time % 60;

      const minutesTotal = (time - seconds) / 60;
      const minutes = minutesTotal % 60;

      const hoursTotal = time - seconds - minutes * 60;
      const hours = hoursTotal / 3600;

      setMinutes(minutes);
      setHours(hours);
    }

    if (time === 0) {
      setMinutes(0);
      setHours(0);
    }
  }, [time]);

  return {
    handleRightButtonAction,
    timerState,
    handleLeftButtonAction,
    today,
    editorOpen,
    handleCloseEditor,
    sliderOpen,
    handleOpenSlider,
    handleCloseSlider,
    handleTimeAdded,
    time,
    report_date,
  };
};

export default useMinistryTimer;
