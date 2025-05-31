import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { PersonSelectorType } from '../index.types';
import {
  CODisplayNameState,
  COFullnameState,
  displayNameMeetingsEnableState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useCircuitOverseer = ({ week, assignment }: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);

  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const displayName = useAtomValue(CODisplayNameState);
  const fullname = useAtomValue(COFullnameState);
  const schedules = useAtomValue(schedulesState);

  const [value, setValue] = useState('');

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const valueOverride = useMemo(() => {
    if (week.length === 0) return null;

    const path = ASSIGNMENT_PATH[assignment];

    if (!path) return null;

    const assigned = schedulesGetData(schedule, path) as AssignmentCongregation;
    const name = assigned.value.length > 0 ? assigned.value : null;

    return name;
  }, [week, assignment, schedule]);

  const handleValueChange = async (text: string) => {
    setValue(text);

    try {
      if (text.length === 0) {
        await schedulesSaveAssignment(schedule, assignment, '');
      }
    } catch (error) {
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
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  useEffect(() => {
    if (valueOverride) {
      setValue(valueOverride);
    }

    if (!valueOverride) {
      if (!displayNameEnabled) {
        setValue(fullname);
      }

      if (displayNameEnabled) {
        setValue(displayName);
      }
    }
  }, [valueOverride, displayName, displayNameEnabled, fullname]);

  return {
    value,
    valueOverride,
    handleValueSave,
    handleValueChange,
  };
};

export default useCircuitOverseer;
