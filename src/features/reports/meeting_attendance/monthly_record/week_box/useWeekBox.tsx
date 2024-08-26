import { ChangeEvent, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { getWeekDate } from '@utils/date';
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

  const [present, setPresent] = useState(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
    const currentRecord = weeklyAttendance[type].find(
      (record) => record.type === dataView
    );
    const present = currentRecord.present?.toString() || '';
    return present;
  });

  const [online, setOnline] = useState(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
    const currentRecord = weeklyAttendance[type].find(
      (record) => record.type === dataView
    );
    const online = currentRecord.online?.toString() || '';
    return online;
  });

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
