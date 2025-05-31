import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { SwitchCheckboxType } from './index.types';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useSwitchCheckbox = (
  weekOf: string,
  meeting: SwitchCheckboxType['meeting']
) => {
  const schedules = useAtomValue(schedulesState);
  const userDataView = useAtomValue(userDataViewState);

  const [meetingCanceled, setMeetingCanceled] = useState(false);

  const handleToggleCanceled = async (value: boolean) => {
    if (meeting === 'midweek') {
      const schedule = schedules.find((record) => record.weekOf === weekOf);

      const midweekCanceled = schedule.midweek_meeting.canceled;
      const newRecord = structuredClone(midweekCanceled);

      const userRecord = newRecord.find(
        (record) => record.type === userDataView
      );

      userRecord.value = value;
      userRecord.updatedAt = new Date().toISOString();

      await dbSchedUpdate(weekOf, { 'midweek_meeting.canceled': newRecord });
    }

    if (meeting === 'weekend') {
      const schedule = schedules.find((record) => record.weekOf === weekOf);

      const weekendCanceled = schedule.weekend_meeting.canceled;
      const newRecord = structuredClone(weekendCanceled);

      const userRecord = newRecord.find(
        (record) => record.type === userDataView
      );

      userRecord.value = value;
      userRecord.updatedAt = new Date().toISOString();

      await dbSchedUpdate(weekOf, { 'weekend_meeting.canceled': newRecord });
    }
  };

  useEffect(() => {
    if (weekOf.length > 0 && meeting === 'midweek') {
      const schedule = schedules.find((record) => record.weekOf === weekOf);
      const canceled = schedule.midweek_meeting.canceled.find(
        (record) => record.type === userDataView
      ).value;
      setMeetingCanceled(canceled);
    }

    if (weekOf.length > 0 && meeting === 'weekend') {
      const schedule = schedules.find((record) => record.weekOf === weekOf);
      const canceled = schedule.weekend_meeting.canceled.find(
        (record) => record.type === userDataView
      ).value;
      setMeetingCanceled(canceled);
    }
  }, [weekOf, meeting, schedules, userDataView]);

  return { meetingCanceled, handleToggleCanceled };
};

export default useSwitchCheckbox;
