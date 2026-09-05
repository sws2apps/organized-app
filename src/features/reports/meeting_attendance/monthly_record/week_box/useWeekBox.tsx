import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
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
import { addDays, formatDate, getWeekDate, weeksInMonth } from '@utils/date';
import {
  WeekBoxDraft,
  WeekBoxField,
  WeekBoxProps,
  WeekBoxValues,
} from './index.types';
import {
  meetingAttendanceState,
  meetingAttendanceSaveState,
} from '@states/meeting_attendance';
import {
  AttendanceValues,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import {
  attendanceDeafRecordState,
  attendanceOnlineRecordState,
  userDataViewState,
  settingsState,
  COMidweekMeetingDayState,
} from '@states/settings';
import { monthShortNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const EMPTY_VALUES: WeekBoxValues = {
  present: '',
  online: '',
  presentDeaf: '',
  onlineDeaf: '',
};

// stored counts include the deaf attendees, so the hearing input holds the rest
const hearingCount = (total?: number, deaf?: number) => {
  const hearing = (total || 0) - (deaf || 0);

  return total === undefined ? '' : String(Math.max(0, hearing));
};

const useWeekBox = ({ month, index, type, view }: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const isTouchDevice = useIsTouchDevice();
  const { laptopDown } = useBreakpoints();

  const attendances = useAtomValue(meetingAttendanceState);
  const saveAttendanceRecord = useSetAtom(meetingAttendanceSaveState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnline = useAtomValue(attendanceOnlineRecordState);
  const recordDeaf = useAtomValue(attendanceDeafRecordState);
  const months = useAtomValue(monthShortNamesState);
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);
  useAtomValue(COMidweekMeetingDayState);

  const currentView = view || dataView;

  const [focusedField, setFocusedField] = useState<ClickerTab | null>(null);
  const [clickerOpen, setClickerOpen] = useState(false);

  const schedule = useMemo(() => {
    const week = weeksInMonth(month)[index - 1];
    return schedules.find((record) => record.weekOf === week);
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

  const recordKey = `${month}-${index}-${type}-${currentView}-${recordDeaf}-${recordOnline}`;
  const [drafts, setDrafts] = useState<WeekBoxDraft>({
    key: recordKey,
    values: {},
  });
  const versions = useRef<Partial<Record<keyof WeekBoxValues, number>>>({});
  const values = useMemo(
    () => ({
      ...initialValues,
      ...(drafts.key === recordKey ? drafts.values : {}),
    }),
    [initialValues, drafts, recordKey]
  );

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

  const box_label = (() => {
    const week = weeksList[index - 1];

    const meetingDateInit = schedulesGetMeetingDate({
      week,
      meeting: type,
      dataView: currentView,
    });
    const weekday =
      settings.cong_settings[`${type}_meeting`].find(
        (record) => record.type === currentView
      )?.weekday.value ?? (type === 'midweek' ? 2 : 5);
    const meetingDate = meetingDateInit.date
      ? new Date(meetingDateInit.date)
      : addDays(new Date(week), weekday);

    const monthIndex = meetingDate.getMonth();
    const date = meetingDate.getDate();

    const dateLabel = t('tr_longDateNoYearLocale', {
      month: months[monthIndex],
      date,
    });

    return dateLabel;
  })();

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

  const saveAttendance = async (changes: Partial<WeekBoxValues>) => {
    if (noMeeting) return;
    const changedFields = Object.keys(changes) as (keyof WeekBoxValues)[];
    if (changedFields.length === 0) return;
    const revision = Object.fromEntries(
      changedFields.map((field) => {
        versions.current[field] = (versions.current[field] ?? 0) + 1;
        return [field, versions.current[field]];
      })
    );
    setDrafts((current) => ({
      key: recordKey,
      values: {
        ...(current.key === recordKey ? current.values : {}),
        ...changes,
      },
    }));
    const counts: AttendanceValues = {};
    for (const field of changedFields) {
      const storedField =
        field === 'presentDeaf'
          ? 'present_deaf'
          : field === 'onlineDeaf'
            ? 'online_deaf'
            : field;
      counts[storedField] = changes[field];
    }
    await saveAttendanceRecord({
      values: counts,
      recordDeaf,
      index,
      month,
      type,
      dataView: currentView,
    });
    setDrafts((current) => {
      if (current.key !== recordKey) return current;
      const next = { ...current.values };
      for (const field of changedFields) {
        if (versions.current[field] === revision[field]) delete next[field];
      }
      return { key: recordKey, values: next };
    });
  };

  const handleValueChange =
    (field: keyof WeekBoxValues) => (e: ChangeEvent<HTMLInputElement>) => {
      if (
        e.target.validity.badInput ||
        e.target.value.match(/\D/) ||
        !Number.isSafeInteger(Number(e.target.value))
      ) {
        e.preventDefault();
        return;
      }

      const tmpValue = e.target.value;
      const value = tmpValue === '' ? '' : String(+tmpValue);

      void saveAttendance({ [field]: value });
    };

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

  const handleClickerSave = (counts: ClickerSaveValues) => {
    const next: Partial<WeekBoxValues> = {};
    if (counts.present !== undefined) next.present = String(counts.present);
    if (counts.online !== undefined) next.online = String(counts.online);
    void saveAttendance(next);
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
    focusedField,
    handleFieldFocus,
    handleFieldBlur,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  };
};

export default useWeekBox;
