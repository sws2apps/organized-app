import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { AuxClassGroupProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useAuxClassGroup = ({ selectedWeek }: AuxClassGroupProps) => {
  const schedules = useRecoilValue(schedulesState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const initialValue = useMemo(() => {
    if (!schedule) return '';

    return schedule.midweek_meeting.aux_fsg?.value || '';
  }, [schedule]);

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

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, handleGroupChange };
};

export default useAuxClassGroup;
