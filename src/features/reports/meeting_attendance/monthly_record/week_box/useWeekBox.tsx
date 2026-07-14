import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import {
  WEEK_TYPE_LANGUAGE_GROUPS,
  WEEK_TYPE_NO_MEETING,
} from '@constants/index';
import {
  useAppTranslation,
  useBreakpoints,
  useIsTouchDevice,
} from '@hooks/index';
import {
  ClickerSaveValues,
  ClickerTab,
} from '../clicker_mode/index.types';
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
import {
  meetingAttendanceCountsSave,
  meetingAttendancePresentSave,
} from '@services/app/meeting_attendance';
import { monthShortNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const isTouchDevice = useIsTouchDevice();
  const { laptopDown } = useBreakpoints();

  const attendances = useAtomValue(meetingAttendanceState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnline = useAtomValue(attendanceOnlineRecordState);
  const months = useAtomValue(monthShortNamesState);
  const schedules = useAtomValue(schedulesState);

  const [focusedField, setFocusedField] = useState<ClickerTab | null>(null);
  const [clickerOpen, setClickerOpen] = useState(false);

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

    const meetingDateInit = schedulesGetMeetingDate({
      week,
      meeting: type,
      dataView: view,
    });

    const meetingDate = addWeeks(meetingDateInit.date, index - 1);

    const monthIndex = meetingDate.getMonth();
    const date = meetingDate.getDate();

    const dateLabel = t('tr_longDateNoYearLocale', {
      month: months[monthIndex],
      date,
    });

    return dateLabel;
  }, [month, type, index, t, months, view]);

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

  // Shown on narrow viewports or any touch device (catches large iPads);
  // hidden only on wide, mouse-driven desktops.
  const clickerEnabled = (laptopDown || isTouchDevice) && !noMeeting;

  const clickerTitle = useMemo(() => {
    const meetingLabel =
      type === 'midweek' ? t('tr_midweekMeeting') : t('tr_weekendMeeting');

    return `${box_label}: ${meetingLabel}`;
  }, [box_label, type, t]);

  const handleFieldFocus = (field: ClickerTab) => setFocusedField(field);

  const handleFieldBlur = () => setFocusedField(null);

  const handleClickerOpen = () => setClickerOpen(true);

  const handleClickerClose = () => setClickerOpen(false);

  const handleClickerSave = (values: ClickerSaveValues) => {
    const counts: { record: 'present' | 'online'; count: string }[] = [];

    if (values.present !== undefined) {
      const value = values.present.toString();
      setPresent(value);
      counts.push({ record: 'present', count: value });
    }

    if (values.online !== undefined) {
      const value = values.online.toString();
      setOnline(value);
      counts.push({ record: 'online', count: value });
    }

    if (counts.length === 0) return;

    // Persist both counts in one atomic write — the debounced single-field save
    // would collapse two back-to-back calls and drop a value.
    meetingAttendanceCountsSave({
      index,
      month,
      type,
      counts,
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
    clickerEnabled,
    clickerOpen,
    clickerTitle,
    focusedField,
    handleFieldFocus,
    handleFieldBlur,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  };
};

export default useWeekBox;
