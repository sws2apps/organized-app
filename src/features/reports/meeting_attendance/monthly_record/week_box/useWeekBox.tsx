import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { getWeekDate, weeksInMonth } from '@utils/date';
import { WeekBoxProps } from './index.types';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';
import {
  attendanceOnlineRecordState,
  userDataViewState,
} from '@states/settings';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';

const useWeekBox = ({ month, index, type }: WeekBoxProps) => {
  const attendances = useRecoilValue(meetingAttendanceState);
  const dataView = useRecoilValue(userDataViewState);
  const recordOnline = useRecoilValue(attendanceOnlineRecordState);

  const [present, setPresent] = useState('');
  const [online, setOnline] = useState('');

  useEffect(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    if (attendance) {
      const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
      const currentRecord = weeklyAttendance[type].find(
        (record) => record.type === dataView
      );
      const newPresent = currentRecord.present?.toString() || '';

      setPresent(newPresent);
      return;
    }

    setPresent('');
  }, [attendances, dataView, index, month, type]);

  useEffect(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    if (attendance) {
      const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
      const currentRecord = weeklyAttendance[type].find(
        (record) => record.type === dataView
      );
      const newOnline = currentRecord.online?.toString() || '';
      setOnline(newOnline);
      return;
    }

    setOnline('');
  }, [attendances, dataView, index, month, type]);

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

  const weeksList = useMemo(() => {
    const weeks = weeksInMonth(month);
    return weeks;
  }, [month]);

  const isMidweek = useMemo(() => {
    const today = new Date().getDay();

    return today > 0 && today < 6;
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

  const handlePresentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/\D/)) {
      e.preventDefault();

      return;
    }

    const tmpValue = e.target.value;
    const value = tmpValue === '' ? '' : String(+tmpValue).toString();
    setPresent(value);

    meetingAttendancePresentSave({
      count: value,
      index,
      month,
      type,
      record: 'present',
    });
  };

  const handleOnlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/\D/)) {
      e.preventDefault();

      return;
    }

    const tmpValue = e.target.value;
    const value = tmpValue === '' ? '' : String(+tmpValue).toString();
    setOnline(value);

    meetingAttendancePresentSave({
      count: value,
      index,
      month,
      type,
      record: 'online',
    });
  };

  return {
    isCurrent,
    handlePresentChange,
    present,
    recordOnline,
    online,
    handleOnlineChange,
    total,
    isMidweek,
    isWeekend,
  };
};

export default useWeekBox;
