import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonSelectorType } from '../index.types';
import { userDataViewState } from '@states/settings';
import { schedulesState } from '@states/schedules';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';

const useStreamSpeaker = ({ week, assignment }: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>();

  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);

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

    const name = assigned.value.length > 0 ? assigned.value : '';

    return name;
  }, [week, assignment, schedule, dataView]);

  const handleValueChange = async (text: string) => {
    setValue(text);

    if (text.length === 0) {
      await schedulesSaveAssignment(schedule, assignment, '');
    }
  };

  const handleValueSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleValueSaveDb, 1000);
  };

  const handleValueSaveDb = async () => {
    await schedulesSaveAssignment(schedule, assignment, value);
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
