import { useRecoilValue } from 'recoil';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { OutgoingTalkScheduleType } from '@definition/schedules';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useOutgoingTalks = () => {
  const selectedWeek = useRecoilValue(selectedWeekState);
  const dataView = useRecoilValue(userDataViewState);
  const schedules = useRecoilValue(schedulesState);

  const schedule = schedules.find((record) => record.weekOf === selectedWeek);

  const outgoingTalkSchedules =
    schedule?.weekend_meeting.outgoing_talks.filter(
      (record) => record._deleted === false
    ) || [];

  const handleAddOutgoingTalk = async () => {
    const scheduleNew: OutgoingTalkScheduleType = {
      _deleted: false,
      updatedAt: '',
      synced: false,
      id: crypto.randomUUID(),
      opening_song: '',
      public_talk: undefined,
      speaker: '',
      type: dataView,
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

  return { selectedWeek, handleAddOutgoingTalk, outgoingTalkSchedules };
};

export default useOutgoingTalks;
