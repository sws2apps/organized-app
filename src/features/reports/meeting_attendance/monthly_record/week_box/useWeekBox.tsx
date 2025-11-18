import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import {
  WEEK_TYPE_LANGUAGE_GROUPS,
  WEEK_TYPE_NO_MEETING,
} from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import {
  addWeeks,
  firstWeekMonth,
  formatDate,
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
  userDataViewState,
} from '@states/settings';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';
import { monthShortNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const attendances = useAtomValue(meetingAttendanceState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnline = useAtomValue(attendanceOnlineRecordState);
  const months = useAtomValue(monthShortNamesState);
  const schedules = useAtomValue(schedulesState);

  const schedule = useMemo(() => {
    const weeks = schedules.filter((record) => record.weekOf.includes(month));
    const week = weeks.at(index - 1);

    return week;
  }, [schedules, month, index]);

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

  const noMeeting = useMemo(() => {
    let weekType = Week.NORMAL;

    if (!schedule) return false;

    if (type === 'midweek') {
      weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === (view || dataView)
        )?.value ?? Week.NORMAL;
    }

    if (type === 'weekend') {
      weekType =
        schedule.weekend_meeting.week_type.find(
          (record) => record.type === (view || dataView)
        )?.value ?? Week.NORMAL;
    }

    return (
      WEEK_TYPE_NO_MEETING.includes(weekType) ||
      WEEK_TYPE_LANGUAGE_GROUPS.includes(weekType)
    );
  }, [type, schedule, view, dataView]);

  const box_label = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    const firstWeek = firstWeekMonth(year, monthValue);

    const week = formatDate(firstWeek, 'yyyy/MM/dd');

    const meetingDateInit = schedulesGetMeetingDate({ week, meeting: type });

    const meetingDate = addWeeks(meetingDateInit.date, index - 1);

    const monthIndex = meetingDate.getMonth();
    const date = meetingDate.getDate();

    const dateLabel = t('tr_longDateNoYearLocale', {
      month: months[monthIndex],
      date,
    });

    return dateLabel;
  }, [month, type, index, t, months]);

  useEffect(() => setPresent(presentInitial), [presentInitial]);

  useEffect(() => setOnline(onlineInitial), [onlineInitial]);

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
    noMeeting,
  };
};

export default useWeekBox;
