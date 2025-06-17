import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { PersonSelectorType } from '../index.types';
import { userDataViewState } from '@states/settings';
import { schedulesState } from '@states/schedules';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useStreamSpeaker = ({ week, assignment }: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);

  const [value, setValue] = useState('');

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const defaultValue = useMemo(() => {
    if (week.length === 0) return '';

    const path = ASSIGNMENT_PATH[assignment];

    if (!path) return '';

    const dataSchedule = schedulesGetData(schedule, path);
    let assigned: AssignmentCongregation;

    if (Array.isArray(dataSchedule)) {
      assigned = dataSchedule.find((record) => record.type === dataView);
    } else {
      assigned = dataSchedule;
    }

    const name = assigned?.value ?? '';

    return name;
  }, [week, assignment, schedule, dataView]);

  const handleValueChange = async (text: string) => {
    setValue(text);

    try {
      if (text.length === 0) {
        await schedulesSaveAssignment(schedule, assignment, '');
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleValueSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleValueSaveDb, 1000);
  };

  const handleValueSaveDb = async () => {
    try {
      await schedulesSaveAssignment(schedule, assignment, value);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return {
    value,
    handleValueSave,
    handleValueChange,
  };
};

export default useStreamSpeaker;
