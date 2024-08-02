import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PublicTalkType } from '@definition/schedules';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';

const usePublicTalkTypeSelector = (week: string) => {
  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);

  const [talkType, setTalkType] = useState<PublicTalkType>('localSpeaker');

  const schedule = schedules.find((record) => record.weekOf === week);

  const handleSaveTalkType = async (value: string) => {
    const newValue = value as PublicTalkType;

    const talkType = structuredClone(schedule.weekend_meeting.public_talk_type);

    const local = talkType.find((record) => record.type === dataView);

    local.updatedAt = new Date().toISOString();
    local.value = newValue;

    await dbSchedUpdate(week, { 'weekend_meeting.public_talk_type': talkType });
  };

  useEffect(() => {
    if (schedule) {
      const type =
        schedule.weekend_meeting.public_talk_type.find(
          (record) => record.type === dataView
        )?.value || 'localSpeaker';

      setTalkType(type);
    }
  }, [schedule, dataView]);

  return { talkType, handleSaveTalkType };
};

export default usePublicTalkTypeSelector;
