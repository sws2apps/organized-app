import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { PublicTalkType } from '@definition/schedules';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';

const usePublicTalkTypeSelector = (week: string) => {
  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const initialType = useMemo(() => {
    if (!schedule) return 'localSpeaker';

    return (
      schedule.weekend_meeting.public_talk_type.find(
        (record) => record.type === dataView
      )?.value ?? 'localSpeaker'
    );
  }, [schedule, dataView]);

  const [talkType, setTalkType] = useState(initialType);

  const handleSaveTalkType = async (value: string) => {
    const newValue = value as PublicTalkType;

    const talkType = structuredClone(schedule.weekend_meeting.public_talk_type);

    let typeData = talkType.find((record) => record.type === dataView);

    if (!typeData) {
      talkType.push({ type: dataView, updatedAt: '', value: newValue });
      typeData = talkType.find((record) => record.type === dataView);
    }

    typeData.updatedAt = new Date().toISOString();
    typeData.value = newValue;

    await dbSchedUpdate(week, { 'weekend_meeting.public_talk_type': talkType });
  };

  useEffect(() => {
    setTalkType(initialType);
  }, [initialType]);

  return { talkType, handleSaveTalkType };
};

export default usePublicTalkTypeSelector;
