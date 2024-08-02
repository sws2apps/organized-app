import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksState } from '@states/public_talks';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';
import { PublicTalkType } from '@definition/public_talks';
import { dbSourcesUpdate } from '@services/dexie/sources';

const usePublicTalkSelector = (week: string) => {
  const talks = useRecoilValue(publicTalksState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);

  const [selectedTalk, setSelectedTalk] = useState<PublicTalkType>(null);

  const source = sources.find((record) => record.weekOf === week);

  const handleTalkChange = async (talk: PublicTalkType) => {
    const value = talk?.talk_number;

    const talkData = structuredClone(source.weekend_meeting.public_talk);

    let data = talkData.find((record) => record.type === dataView);

    if (!data) {
      talkData.push({ type: dataView, updatedAt: '', value: '' });

      data = talkData.find((record) => record.type === dataView);
    }

    data.updatedAt = new Date().toISOString();
    data.value = value;

    await dbSourcesUpdate(week, {
      'weekend_meeting.public_talk': talkData,
    });
  };

  useEffect(() => {
    setSelectedTalk(null);

    if (source) {
      const talk = source.weekend_meeting.public_talk.find(
        (record) => record.type === dataView
      )?.value as number;
      if (talk) {
        const selectedTalk = talks.find(
          (record) => record.talk_number === talk
        );
        setSelectedTalk(selectedTalk);
      }
    }
  }, [source, dataView, talks]);

  return { talks, selectedTalk, handleTalkChange };
};

export default usePublicTalkSelector;
