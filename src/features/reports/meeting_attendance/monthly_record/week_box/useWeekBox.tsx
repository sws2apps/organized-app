import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
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
import { WeekBoxField, WeekBoxProps, WeekBoxValues } from './index.types';
import { meetingAttendanceState } from '@states/meeting_attendance';
import {
  AttendanceValues,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import {
  attendanceDeafRecordState,
  attendanceOnlineRecordState,
  userDataViewState,
} from '@states/settings';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';
import { monthShortNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const EMPTY_VALUES: WeekBoxValues = {
  present: '',
  online: '',
  presentDeaf: '',
  onlineDeaf: '',
};

const sumCounts = (a: string, b: string) => {
  if (a.length === 0 && b.length === 0) return '';

  return String(+a + +b);
};

// stored counts include the deaf attendees, so the hearing input holds the rest
const hearingCount = (total?: number, deaf?: number) => {
  const hearing = (total || 0) - (deaf || 0);

  return hearing > 0 ? String(hearing) : '';
};

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const attendances = useAtomValue(meetingAttendanceState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnline = useAtomValue(attendanceOnlineRecordState);
  const recordDeaf = useAtomValue(attendanceDeafRecordState);
  const months = useAtomValue(monthShortNamesState);
  const schedules = useAtomValue(schedulesState);

  const currentView = view || dataView;

  const schedule = useMemo(() => {
    const weeks = schedules.filter((record) => record.weekOf.includes(month));
    const week = weeks.at(index - 1);

    return week;
  }, [schedules, month, index]);

  const weekRecord = useMemo(() => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    if (!attendance) return;

    const weeklyAttendance = attendance[`week_${index}`] as WeeklyAttendance;

    return weeklyAttendance[type].find((record) => record.type === currentView);
  }, [attendances, currentView, index, month, type]);

  const initialValues = useMemo<WeekBoxValues>(() => {
    if (!weekRecord) return EMPTY_VALUES;

    if (!recordDeaf) {
      return {
        ...EMPTY_VALUES,
        present: weekRecord.present?.toString() || '',
        online: weekRecord.online?.toString() || '',
      };
    }

    return {
      present: hearingCount(weekRecord.present, weekRecord.present_deaf),
      online: hearingCount(weekRecord.online, weekRecord.online_deaf),
      presentDeaf: weekRecord.present_deaf?.toString() || '',
      onlineDeaf: weekRecord.online_deaf?.toString() || '',
    };
  }, [weekRecord, recordDeaf]);

  const [values, setValues] = useState(initialValues);

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

  const isMeetingDay = useMemo(() => {
    return (
      (type === 'midweek' && isMidweek) || (type === 'weekend' && isWeekend)
    );
  }, [type, isMidweek, isWeekend]);

  const isCurrent = useMemo(() => {
    if (!isMeetingDay) return false;

    const thisWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
    const findIndex = weeksList.findIndex((record) => record === thisWeek);

    return findIndex === index - 1;
  }, [weeksList, index, isMeetingDay]);

  const noMeeting = useMemo(() => {
    let weekType = Week.NORMAL;

    if (!schedule) return false;

    if (type === 'midweek') {
      weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === currentView
        )?.value ?? Week.NORMAL;
    }

    if (type === 'weekend') {
      weekType =
        schedule.weekend_meeting.week_type.find(
          (record) => record.type === currentView
        )?.value ?? Week.NORMAL;
    }

    return (
      WEEK_TYPE_NO_MEETING.includes(weekType) ||
      WEEK_TYPE_LANGUAGE_GROUPS.includes(weekType)
    );
  }, [type, schedule, currentView]);

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

  const detailed = recordOnline || recordDeaf;

  const fields = useMemo(() => {
    const result: WeekBoxField[] = [];

    if (recordDeaf) {
      result.push(
        {
          name: 'presentDeaf',
          label: t('tr_deaf'),
          section: recordOnline ? t('tr_present') : undefined,
        },
        { name: 'present', label: t('tr_hearing') }
      );
    } else {
      result.push({
        name: 'present',
        label: recordOnline ? t('tr_present') : box_label,
      });
    }

    if (recordOnline && recordDeaf) {
      result.push(
        { name: 'onlineDeaf', label: t('tr_deaf'), section: t('tr_online') },
        { name: 'online', label: t('tr_hearing') }
      );
    } else if (recordOnline) {
      result.push({ name: 'online', label: t('tr_online') });
    }

    return result;
  }, [recordDeaf, recordOnline, box_label, t]);

  const total = useMemo(() => {
    return fields.reduce((acc, field) => acc + (+values[field.name] || 0), 0);
  }, [fields, values]);

  const savedValues = useRef(initialValues);

  // saving one field echoes back the whole record, so only fields that changed in
  // the database are refreshed, otherwise a slow echo overwrites a newer input
  useEffect(() => {
    const previous = savedValues.current;
    savedValues.current = initialValues;

    setValues((current) => {
      const fieldNames = Object.keys(current) as (keyof WeekBoxValues)[];

      return fieldNames.reduce(
        (acc, field) => ({
          ...acc,
          [field]:
            initialValues[field] === previous[field]
              ? current[field]
              : initialValues[field],
        }),
        {} as WeekBoxValues
      );
    });
  }, [initialValues]);

  const saveAttendance = (newValues: WeekBoxValues) => {
    const counts: AttendanceValues = {
      present: recordDeaf
        ? sumCounts(newValues.present, newValues.presentDeaf)
        : newValues.present,
    };

    if (recordDeaf) {
      counts.present_deaf = newValues.presentDeaf;
    }

    if (recordOnline) {
      counts.online = recordDeaf
        ? sumCounts(newValues.online, newValues.onlineDeaf)
        : newValues.online;
    }

    if (recordOnline && recordDeaf) {
      counts.online_deaf = newValues.onlineDeaf;
    }

    meetingAttendancePresentSave({
      values: counts,
      index,
      month,
      type,
      dataView: currentView,
    });
  };

  const handleValueChange =
    (field: keyof WeekBoxValues) => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.match(/\D/)) {
        e.preventDefault();
        return;
      }

      const tmpValue = e.target.value;
      const value = tmpValue === '' ? '' : String(+tmpValue);

      const newValues = { ...values, [field]: value };

      setValues(newValues);
      saveAttendance(newValues);
    };

  return {
    isCurrent,
    isMeetingDay,
    detailed,
    fields,
    values,
    handleValueChange,
    total,
    box_label,
    noMeeting,
  };
};

export default useWeekBox;
