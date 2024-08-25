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
import { userDataViewState } from '@states/settings';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';

const useWeekBox = ({ month, index, type, record }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const timer = useRef<NodeJS.Timeout>();

  const attendances = useRecoilValue(meetingAttendanceState);
  const dataView = useRecoilValue(userDataViewState);

  const [value, setValue] = useState('');

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

  const isCurrent = useMemo(() => {
    const today = new Date().getDay();

    const thisWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
    const findIndex = weeksList.findIndex((record) => record === thisWeek);

    if (type === 'midweek' && today > 0 && today < 5) {
      return findIndex === index - 1;
    }

    if (type === 'weekend' && (today === 0 || today === 6)) {
      return findIndex === index - 1;
    }
  }, [weeksList, index, type]);

  const handleValueChange = (value: string) => setValue(value);

  const handleValueSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleValueSaveDb, 1000);
  };

  const handleValueSaveDb = async () => {
    try {
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

      current[record] = value.length === 0 ? undefined : +value;
      current.updatedAt = new Date().toISOString();

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
    setValue('');

    if (!attendance) return;

    const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;
    const currentRecord = weeklyAttendance[type].find(
      (record) => record.type === dataView
    );

    const value = currentRecord[record]?.toString() || '';
    setValue(value);
  }, [month, type, record, index, dataView, attendance]);

  return { isCurrent, handleValueChange, handleValueSave, value };
};

export default useWeekBox;
