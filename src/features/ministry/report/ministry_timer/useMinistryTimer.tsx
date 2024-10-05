import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { TimerState } from './index.types';
import { formatDate } from '@services/dateformat';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
} from '@states/user_field_service_reports';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { userFieldServiceDailyReportSchema } from '@services/dexie/schema';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';

const useMinistryTimer = () => {
  const timerRef = useRef<NodeJS.Timeout>(null);

  const setSelectedMonth = useSetRecoilState(reportUserSelectedMonthState);

  const reports = useRecoilValue(userFieldServiceDailyReportsState);

  const reportDate = useMemo(() => {
    const today = formatDate(new Date(), 'yyyy/MM/dd');

    return reports.find((record) => record.report_date === today);
  }, [reports]);

  const { timer } = useMinistryDailyRecord(reportDate);

  // restore state from db if timer state left as started
  const initialTime = useMemo(() => {
    if (timer.state === 'started') {
      const now = Date.now();
      const elapsedTime = timer.value;

      const additionalTime = Math.floor((now - timer.start) / 1000);
      return elapsedTime + additionalTime;
    }

    return timer.value;
  }, [timer]);

  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState('00:00');
  const [timerState, setTimerState] = useState<TimerState>(timer.state);
  const [editorOpen, setEditorOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleStart = async () => {
    setTimerState('started');

    let report: UserFieldServiceDailyReportType;

    if (!reportDate) {
      report = structuredClone(userFieldServiceDailyReportSchema);
      report.report_date = formatDate(new Date(), 'yyyy/MM/dd');
    }

    if (reportDate) {
      report = structuredClone(reportDate);
    }

    report.report_data.timer.start = Date.now();
    report.report_data.timer.state = 'started';

    await dbUserFieldServiceReportsSave(report);
  };

  const handlePause = async () => {
    setTimerState('paused');

    const report = structuredClone(reportDate);
    report.report_data.timer.state = 'paused';
    report.report_data.timer.value = time;

    await dbUserFieldServiceReportsSave(report);
  };

  const handleAddTime = async () => {
    let report = structuredClone(reportDate);

    if (!report) {
      report = structuredClone(userFieldServiceDailyReportSchema);
      report.report_date = formatDate(new Date(), 'yyyy/MM/dd');

      await dbUserFieldServiceReportsSave(report);
    }

    setSelectedMonth(report.report_date.slice(0, 7));
    setEdit(false);
    setEditorOpen(true);
  };

  const handleStop = async () => {
    setTimerState('not_started');
    setTime(0);

    const report = structuredClone(reportDate);
    report.report_data.timer.state = 'not_started';
    report.report_data.timer.value = 0;
    report.report_data.timer.start = 0;

    await dbUserFieldServiceReportsSave(report);

    if (hours > 0 || minutes > 0) {
      const draftReport = structuredClone(report);

      const currentHours = draftReport.report_data.hours.field_service;

      if (currentHours.length === 0) {
        draftReport.report_data.hours.field_service = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }

      if (currentHours.length > 0) {
        let [tHours, tMinutes] =
          report.report_data.hours.field_service.split(':');

        tHours = String(+tHours + hours);
        tMinutes = String(+tMinutes + minutes);

        if (+tMinutes >= 60) {
          tMinutes = String(+tMinutes - 60);
          tHours = String(+tHours + 1);
        }

        draftReport.report_data.hours.field_service = `${String(tHours).padStart(2, '0')}:${String(tMinutes).padStart(2, '0')}`;
      }

      await dbUserFieldServiceReportsSave(draftReport);

      setSelectedMonth(draftReport.report_date.slice(0, 7));
      setEdit(true);
      setEditorOpen(true);
    }
  };

  const handleLeftButtonAction = async () => {
    if (timerState === 'started' || timerState === 'paused') {
      await handleStop();
    }

    if (timerState === 'not_started') {
      await handleAddTime();
    }
  };

  const handleRightButtonAction = async () => {
    if (timerState === 'not_started' || timerState === 'paused') {
      await handleStart();
    }

    if (timerState === 'started') {
      await handlePause();
    }
  };

  const handleCloseEditor = () => setEditorOpen(false);

  const handleOpenSlider = () => {
    if (timerState === 'started') return;

    setSliderOpen(true);
  };

  const handleCloseSlider = () => setSliderOpen(false);

  const handleTimeAdded = async (value: number) => {
    const newValue = time + value;

    setTime(newValue);

    let report: UserFieldServiceDailyReportType;

    if (!reportDate) {
      report = structuredClone(userFieldServiceDailyReportSchema);
      report.report_date = formatDate(new Date(), 'yyyy/MM/dd');
    }

    if (reportDate) {
      report = structuredClone(reportDate);
    }

    report.report_data.timer.value = newValue;

    await dbUserFieldServiceReportsSave(report);
  };

  // restore state from db on tab active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (timer.state === 'started') {
          const now = Date.now();
          const elapsedTime = timer.value;

          const additionalTime = Math.floor((now - timer.start) / 1000);
          setTime(elapsedTime + additionalTime);
        } else {
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

  // update duration value
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

      let value: string;

      if (hours === 0) {
        value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }

      if (hours > 0) {
        value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }

      setDuration(value);
    }

    if (time === 0) {
      setMinutes(0);
      setHours(0);
      setDuration('00:00');
    }
  }, [time]);

  return {
    duration,
    handleRightButtonAction,
    timerState,
    handleLeftButtonAction,
    reportDate,
    editorOpen,
    edit,
    handleCloseEditor,
    sliderOpen,
    handleOpenSlider,
    handleCloseSlider,
    handleTimeAdded,
  };
};

export default useMinistryTimer;
