import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { OutgoingTalkScheduleType } from '@definition/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { userDataViewState } from '@states/settings';

const useOutgoingTalks = () => {
  const selectedWeek = useAtomValue(selectedWeekState);
  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const outgoingTalkSchedules =
    schedule?.weekend_meeting.outgoing_talks.filter(
      (record) => record._deleted === false
    ) || [];

  const handleAddOutgoingTalk = async () => {
    const scheduleNew: OutgoingTalkScheduleType = {
      type: dataView,
      value: '',
      _deleted: false,
      updatedAt: '',
      synced: false,
      id: crypto.randomUUID(),
      opening_song: '',
      public_talk: undefined,
      congregation: {
        address: '',
        country: '',
        name: '',
        number: '',
        time: '',
        weekday: undefined,
      },
    };

    const outgoingSchedules = structuredClone(
      schedule.weekend_meeting.outgoing_talks
    );
    outgoingSchedules.push(scheduleNew);

    await dbSchedUpdate(selectedWeek, {
      'weekend_meeting.outgoing_talks': outgoingSchedules,
    });
  };

  return {
    selectedWeek,
    handleAddOutgoingTalk,
    outgoingTalkSchedules,
  };
};

export default useOutgoingTalks;
