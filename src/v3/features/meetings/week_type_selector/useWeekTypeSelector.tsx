import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { weekTypeLocaleState } from '@states/weekType';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { WeekTypeSelectorType } from './index.types';

const useWeekTypeSelector = ({ meeting, week }: WeekTypeSelectorType) => {
  const weekTypeOptions = useRecoilValue(weekTypeLocaleState);
  const schedules = useRecoilValue(schedulesState);
  const userDataView = useRecoilValue(userDataViewState);

  const [weekType, setWeekType] = useState(Week.NORMAL);

  const handleWeekTypeChange = async (value: Week) => {
    // custom handler for no meeting

    if (value === Week.NO_MEETING) {
      const schedule = schedules.find((record) => record.weekOf === week);

      if (meeting === 'midweek') {
        const midweekCanceled = schedule.midweek_meeting.canceled;
        const newRecord = structuredClone(midweekCanceled);

        const userRecord = newRecord.find((record) => record.type === userDataView);

        userRecord.value = false;
        userRecord.updatedAt = new Date().toISOString();

        await dbSchedUpdate(week, { 'midweek_meeting.canceled': newRecord });
      }

      if (meeting === 'weekend') {
        const weekendCanceled = schedule.weekend_meeting.canceled;
        const newRecord = structuredClone(weekendCanceled);

        const userRecord = newRecord.find((record) => record.type === userDataView);

        userRecord.value = false;
        userRecord.updatedAt = new Date().toISOString();

        await dbSchedUpdate(week, { 'weekend_meeting.canceled': newRecord });
      }

      return;
    }

    // normal week type switch
    const weekTypeRecord = schedules.find((record) => record.weekOf === week).week_type;

    const newWeekTypeRecord = structuredClone(weekTypeRecord);
    const mainRecord = newWeekTypeRecord.find((record) => record.type === userDataView);

    mainRecord.value = value;
    mainRecord.updatedAt = new Date().toISOString();

    await dbSchedUpdate(week, { week_type: newWeekTypeRecord });
  };

  useEffect(() => {
    if (week.length > 0) {
      const schedule = schedules.find((record) => record.weekOf === week);

      // check if no meeting and exit out early
      if (meeting === 'midweek') {
        const canceled = schedule.midweek_meeting.canceled.find((record) => record.type === userDataView).value;
        if (canceled) {
          setWeekType(Week.NO_MEETING);
          return;
        }
      }

      if (meeting === 'weekend') {
        const canceled = schedule.weekend_meeting.canceled.find((record) => record.type === userDataView).value;
        if (canceled) {
          setWeekType(Week.NO_MEETING);
          return;
        }
      }

      // normal week type handler
      const weekTypeRecord = schedules.find((record) => record.weekOf === week).week_type;
      const weekType = weekTypeRecord.find((record) => record.type === userDataView).value;

      setWeekType(weekType);
    }
  }, [week, schedules, userDataView, meeting]);

  return { weekTypeOptions, weekType, handleWeekTypeChange };
};

export default useWeekTypeSelector;
