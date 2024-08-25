import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { getWeekDate } from '@utils/date';
import { displaySnackNotification } from '@services/recoil/app';
import { WeekBoxProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { meetingAttendanceSchema } from '@services/dexie/schema';
import {
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import {
  attendanceOnlineRecordState,
  userDataViewState,
} from '@states/settings';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';

const useWeekBox = ({ month, index, type }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const timer = useRef<NodeJS.Timeout>();

  const attendances = useRecoilValue(meetingAttendanceState);
  const dataView = useRecoilValue(userDataViewState);
  const recordOnline = useRecoilValue(attendanceOnlineRecordState);

  const [present, setPresent] = useState('');
  const [online, setOnline] = useState('');

  const total = useMemo(() => {
    let cnTotal = 0;

    if (present.length > 0) {
      cnTotal += +present;
    }

    if (online.length > 0) {
      cnTotal += +online;
    }

    return cnTotal;
  }, [present, online]);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const weeksList = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    const firstDay = new Date(year, monthValue - 1, 1);

    const firstMonday =
      firstDay.getDay() === 1
        ? firstDay
        : new Date(
            year,
            monthValue - 1,
            firstDay.getDate() + ((8 - firstDay.getDay()) % 7)
          );

    const weeks = [];
    const currentMonday = new Date(firstMonday);

    while (currentMonday.getMonth() === firstMonday.getMonth()) {
      weeks.push(formatDate(new Date(currentMonday), 'yyyy/MM/dd'));
      currentMonday.setDate(currentMonday.getDate() + 7);
    }

    return weeks;
  }, [month]);

  const isMidweek = useMemo(() => {
    const today = new Date().getDay();

    return today > 0 && today < 5;
  }, []);

  const isWeekend = useMemo(() => {
    const today = new Date().getDay();

    return today === 0 || today === 6;
  }, []);

  const isCurrent = useMemo(() => {
    const thisWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
    const findIndex = weeksList.findIndex((record) => record === thisWeek);

    if (type === 'midweek' && isMidweek) {
      return findIndex === index - 1;
    }

    if (type === 'weekend' && isWeekend) {
      return findIndex === index - 1;
    }
  }, [weeksList, index, type, isMidweek, isWeekend]);

  const handleUpdateRecord = (record: 'present' | 'online', value: number) => {
    const dbAttendance = attendances.find(
      (record) => record.month_date === month
    );

    let attendance: MeetingAttendanceType;

    if (!dbAttendance) {
      attendance = structuredClone(meetingAttendanceSchema);
      attendance.month_date = month;
    } else {
      attendance = structuredClone(dbAttendance);
    }

    const weekRecord = attendance[`week_${index}`] as WeeklyAttendance;
    const meetingRecord = weekRecord[type];

    let current = meetingRecord.find((record) => record.type === dataView);

    if (!current) {
      meetingRecord.push({
        type: dataView,
        online: undefined,
        present: undefined,
        updatedAt: '',
      });
      current = meetingRecord.find((record) => record.type === dataView);
    }

    current[record] = value;
    current.updatedAt = new Date().toISOString();

    return attendance;
  };

  const handlePresentChange = (value: string) => setPresent(value);

  const handlePresentSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handlePresentSaveDb, 1000);
  };

  const handlePresentSaveDb = async () => {
    try {
      const value = present.length === 0 ? undefined : +present;
      const attendance = handleUpdateRecord('present', value);

      await dbMeetingAttendanceSave(attendance);

      await displaySnackNotification({
        header: t('tr_attendanceRecordAdded'),
        message: t('tr_attendanceRecordAddedDesc'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleOnlineChange = (value: string) => setOnline(value);

  const handleOnlineSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleOnlineSaveDb, 1000);
  };

  const handleOnlineSaveDb = async () => {
    try {
      const value = online.length === 0 ? undefined : +online;
      const attendance = handleUpdateRecord('online', value);

      await dbMeetingAttendanceSave(attendance);

      await displaySnackNotification({
        header: t('tr_attendanceRecordAdded'),
        message: t('tr_attendanceRecordAddedDesc'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setPresent('');
    setOnline('');

    if (!attendance) return;

    const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
    const currentRecord = weeklyAttendance[type].find(
      (record) => record.type === dataView
    );

    const present = currentRecord.present?.toString() || '';
    setPresent(present);

    const online = currentRecord.online?.toString() || '';
    setOnline(online);
  }, [month, type, index, dataView, attendance]);

  return {
    isCurrent,
    handlePresentChange,
    handlePresentSave,
    present,
    recordOnline,
    online,
    handleOnlineChange,
    handleOnlineSave,
    total,
    isMidweek,
    isWeekend,
  };
};

export default useWeekBox;
