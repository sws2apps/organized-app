import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import {
  addDays,
  addWeeks,
  firstWeekMonth,
  getWeekDate,
  weeksInMonth,
} from '@utils/date';
import { WeekBoxProps } from './index.types';
import { meetingAttendanceState } from '@states/meeting_attendance';
import {
  AttendanceCongregation,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import {
  attendanceOnlineRecordState,
  midweekMeetingWeekdayState,
  settingsState,
  userDataViewState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';
import { monthShortNamesState } from '@states/app';

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const attendances = useRecoilValue(meetingAttendanceState);
  const dataView = useRecoilValue(userDataViewState);
  const recordOnline = useRecoilValue(attendanceOnlineRecordState);
  const settings = useRecoilValue(settingsState);
  const midweekDayDefault = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDayDefault = useRecoilValue(weekendMeetingWeekdayState);
  const months = useRecoilValue(monthShortNamesState);

  const midweekDay = useMemo(() => {
    if (!view) return midweekDayDefault;

    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === view
      )?.weekday.value ?? 2
    );
  }, [midweekDayDefault, settings, view]);

  const weekendDay = useMemo(() => {
    if (!view) return weekendDayDefault;

    return (
      settings.cong_settings.weekend_meeting.find(
        (record) => record.type === view
      )?.weekday.value ?? 7
    );
  }, [weekendDayDefault, settings, view]);

  const presentInitial = useMemo(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    if (attendance) {
      const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;

      let currentRecord: AttendanceCongregation;

      if (!view) {
        currentRecord = weeklyAttendance[type].find(
          (record) => record.type === dataView
        );
      }

      if (view) {
        currentRecord = weeklyAttendance[type].find(
          (record) => record.type === view
        );
      }

      const newPresent = currentRecord?.present?.toString() || '';
      return newPresent;
    }

    return '';
  }, [attendances, dataView, index, month, type, view]);

  const onlineInitial = useMemo(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    if (attendance) {
      const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;

      let currentRecord: AttendanceCongregation;

      if (!view) {
        currentRecord = weeklyAttendance[type].find(
          (record) => record.type === dataView
        );
      }

      if (view) {
        currentRecord = weeklyAttendance[type].find(
          (record) => record.type === view
        );
      }

      const newOnline = currentRecord?.online?.toString() || '';
      return newOnline;
    }

    return '';
  }, [attendances, dataView, index, month, type, view]);

  const [present, setPresent] = useState(presentInitial);
  const [online, setOnline] = useState(onlineInitial);

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

  const box_label = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    const firstWeek = firstWeekMonth(year, monthValue);

    let meetingDate: Date;

    if (type === 'midweek') {
      meetingDate = addDays(firstWeek, midweekDay - 1);
    }

    if (type === 'weekend') {
      meetingDate = addDays(firstWeek, weekendDay - 1);
    }

    meetingDate = addWeeks(meetingDate, index - 1);

    const monthIndex = meetingDate.getMonth();
    const date = meetingDate.getDate();

    const dateLabel = t('tr_longDateNoYearLocale', {
      month: months[monthIndex],
      date,
    });

    return dateLabel;
  }, [month, type, midweekDay, weekendDay, index, t, months]);

  useEffect(() => {
    setPresent(presentInitial);
  }, [presentInitial]);

  useEffect(() => {
    setOnline(onlineInitial);
  }, [onlineInitial]);

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
      dataView: view || dataView,
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
      dataView: view || dataView,
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
    box_label,
  };
};

export default useWeekBox;
