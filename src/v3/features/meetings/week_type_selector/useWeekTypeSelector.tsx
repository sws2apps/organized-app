import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { weekTypeLocaleState } from '@states/weekType';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useWeekTypeSelector = (weekOf: string) => {
  const weekTypeOptions = useRecoilValue(weekTypeLocaleState);
  const schedules = useRecoilValue(schedulesState);
  const userDataView = useRecoilValue(userDataViewState);

  const [weekType, setWeekType] = useState(Week.NORMAL);

  const handleWeekTypeChange = async (value: Week) => {
    const weekTypeRecord = schedules.find((record) => record.weekOf === weekOf).week_type;

    const newWeekTypeRecord = structuredClone(weekTypeRecord);
    const mainRecord = newWeekTypeRecord.find((record) => record.type === userDataView);

    mainRecord.value = value;
    mainRecord.updatedAt = new Date().toISOString();

    await dbSchedUpdate(weekOf, { week_type: newWeekTypeRecord });
  };

  useEffect(() => {
    if (weekOf.length > 0) {
      const weekTypeRecord = schedules.find((record) => record.weekOf === weekOf).week_type;
      const weekType = weekTypeRecord.find((record) => record.type === userDataView).value;

      setWeekType(weekType);
    }
  }, [weekOf, schedules, userDataView]);

  return { weekTypeOptions, weekType, handleWeekTypeChange };
};

export default useWeekTypeSelector;
