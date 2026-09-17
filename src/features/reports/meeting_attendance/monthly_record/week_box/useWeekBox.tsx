import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
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
import { ClickerSaveValues, ClickerTab } from '../clicker_mode/index.types';
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
  attendanceRecordSettingsState,
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

const CLICKER_FIELDS: Record<
  'hearing' | 'deaf',
  Record<ClickerTab, keyof WeekBoxValues>
> = {
  hearing: { present: 'present', online: 'online' },
  deaf: { present: 'presentDeaf', online: 'onlineDeaf' },
};

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const isTouchDevice = useIsTouchDevice();
  const { laptopDown } = useBreakpoints();

  const attendances = useAtomValue(meetingAttendanceState);
  const dataView = useAtomValue(userDataViewState);
  const recordSettings = useAtomValue(attendanceRecordSettingsState);
  const months = useAtomValue(monthShortNamesState);
  const schedules = useAtomValue(schedulesState);

  const currentView = view || dataView;

  const recordSetting = recordSettings(currentView);

  const [focusedField, setFocusedField] = useState<keyof WeekBoxValues | null>(
    null
  );
  const [clickerField, setClickerField] =
    useState<keyof WeekBoxValues>('present');
  const [clickerOpen, setClickerOpen] = useState(false);

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

    return {
      present: weekRecord.present?.toString() || '',
      online: weekRecord.online?.toString() || '',
      presentDeaf: weekRecord.present_deaf?.toString() || '',
      onlineDeaf: weekRecord.online_deaf?.toString() || '',
    };
  }, [weekRecord]);

  const [values, setValues] = useState(initialValues);

  // a count kept from before its setting was turned off still adds to the
  // meeting, so its field stays visible for this week, cleared or not
  const weekKey = `${currentView}-${month}-${index}-${type}`;

  const shown = useRef({ key: weekKey, online: false, deaf: false });

  if (shown.current.key !== weekKey) {
    shown.current = { key: weekKey, online: false, deaf: false };
  }

  shown.current.online ||=
    initialValues.online !== '' || initialValues.onlineDeaf !== '';

  shown.current.deaf ||=
    initialValues.presentDeaf !== '' || initialValues.onlineDeaf !== '';

  const recordOnline = recordSetting.online || shown.current.online;
  const recordDeaf = recordSetting.deaf || shown.current.deaf;

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
    return Object.values(values).reduce(
      (acc, value) => acc + (Number(value) || 0),
      0
    );
  }, [values]);

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
    const counts: AttendanceValues = { present: newValues.present };

    if (recordDeaf) {
      counts.present_deaf = newValues.presentDeaf;
    }

    if (recordOnline) {
      counts.online = newValues.online;
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

  const clickerEnabled = (laptopDown || isTouchDevice) && !noMeeting;

  const clickerTitle = useMemo(() => {
    const meetingLabel =
      type === 'midweek' ? t('tr_midweekMeeting') : t('tr_weekendMeeting');

    return `${box_label}: ${meetingLabel}`;
  }, [box_label, type, t]);

  // the counter keeps the present and online tabs; with deaf recording the
  // field it was opened from decides whether it counts the deaf or the hearing
  const clickerDeaf =
    recordDeaf &&
    (clickerField === 'presentDeaf' || clickerField === 'onlineDeaf');

  const clickerFields = CLICKER_FIELDS[clickerDeaf ? 'deaf' : 'hearing'];

  const clickerTab: ClickerTab =
    clickerField === 'online' || clickerField === 'onlineDeaf'
      ? 'online'
      : 'present';

  const clickerSecondaryTitle = recordDeaf
    ? t('tr_meetingAttendanceGroup', {
        label: t('tr_meetingAttendanceRecord'),
        group: clickerDeaf ? t('tr_deaf') : t('tr_hearing'),
      })
    : undefined;

  const handleFieldFocus = (field: keyof WeekBoxValues) =>
    setFocusedField(field);

  const handleFieldBlur = () => setFocusedField(null);

  const handleClickerOpen = () => {
    setClickerField(focusedField ?? 'present');
    setClickerOpen(true);
  };

  const handleClickerClose = () => setClickerOpen(false);

  const handleClickerSave = (counts: ClickerSaveValues) => {
    const changes: Partial<WeekBoxValues> = {};

    if (counts.present !== undefined) {
      changes[clickerFields.present] = String(counts.present);
    }

    if (recordOnline && counts.online !== undefined) {
      changes[clickerFields.online] = String(counts.online);
    }

    if (Object.keys(changes).length === 0) return;

    const newValues = { ...values, ...changes };

    setValues(newValues);
    saveAttendance(newValues);
  };

  return {
    isCurrent,
    isMeetingDay,
    detailed,
    recordOnline,
    fields,
    values,
    handleValueChange,
    total,
    box_label,
    noMeeting,
    clickerEnabled,
    clickerOpen,
    clickerTitle,
    clickerSecondaryTitle,
    clickerTab,
    clickerPresent: Number(values[clickerFields.present]) || 0,
    clickerOnline: Number(values[clickerFields.online]) || 0,
    focusedField,
    handleFieldFocus,
    handleFieldBlur,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  };
};

export default useWeekBox;
