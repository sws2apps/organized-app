import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { AuxClassGroupProps } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { addMonths, formatDate } from '@utils/date';
import { fieldGroupsState } from '@states/field_service_groups';
import {
  midweekMeetingAssigFSGState,
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';

const useAuxClassGroup = ({ selectedWeek }: AuxClassGroupProps) => {
  const schedules = useAtomValue(schedulesState);
  const fieldGroups = useAtomValue(fieldGroupsState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const assignFSG = useAtomValue(midweekMeetingAssigFSGState);
  const dataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const initialValue = useMemo(() => {
    if (!schedule) return '';

    if (fieldGroups.length === 0) return '';

    return schedule.midweek_meeting.aux_fsg?.value || '';
  }, [fieldGroups, schedule]);

  const autoAssign = useMemo(() => {
    if (fieldGroups.length === 0) return { value: false };

    if (!schedule) return { value: false };

    if (initialValue.length > 0) return { value: false };

    const weekType = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value;

    if (classCount < 2 || !assignFSG || weekType !== Week.NORMAL)
      return { value: false };

    // check previous month range values
    let lastValue: string;

    const minDate = formatDate(addMonths(selectedWeek, -1), 'yyyy/MM/dd');

    const weeks = schedules
      .filter(
        (record) => record.weekOf >= minDate && record.weekOf < selectedWeek
      )
      .reverse();

    for (const week of weeks) {
      if (week.midweek_meeting.aux_fsg?.value?.length > 0) {
        lastValue = week.midweek_meeting.aux_fsg.value;
        break;
      }
    }

    if (!lastValue) return { value: false };

    const findIndex = fieldGroups.findIndex(
      (record) => record.group_id === lastValue
    );
    const newIndex = findIndex + 1 > fieldGroups.length - 1 ? 0 : findIndex + 1;

    return { value: true, group: fieldGroups.at(newIndex).group_id };
  }, [
    schedule,
    schedules,
    selectedWeek,
    fieldGroups,
    initialValue,
    classCount,
    assignFSG,
    dataView,
  ]);

  const [value, setValue] = useState(initialValue);

  const handleGroupChange = async (value: string) => {
    setValue(value);

    try {
      await dbSchedUpdate(selectedWeek, {
        'midweek_meeting.aux_fsg': {
          value,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!autoAssign.value) return;

    setValue(autoAssign.group);

    dbSchedUpdate(selectedWeek, {
      'midweek_meeting.aux_fsg': {
        value: autoAssign.group,
        updatedAt: new Date().toISOString(),
      },
    });
  }, [autoAssign, selectedWeek]);

  return { value, handleGroupChange };
};

export default useAuxClassGroup;
