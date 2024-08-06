import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksState } from '@states/public_talks';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { PublicTalkOptionType } from './index.types';
import { PublicTalkType } from '@definition/public_talks';

const usePublicTalkSelector = (week: string) => {
  const talksData = useRecoilValue(publicTalksState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const speakers = useRecoilValue(incomingSpeakersState);

  const [selectedTalk, setSelectedTalk] = useState<PublicTalkOptionType>(null);
  const [openCatalog, setOpenCatalog] = useState(false);

  const source = sources.find((record) => record.weekOf === week);

  const talks = useMemo(() => {
    const data: PublicTalkOptionType[] = talksData.map((talk) => {
      const cnSpeakers = speakers.filter((record) =>
        record.speaker_data.talks.find(
          (item) => item.talk_number === talk.talk_number
        )
      );

      return { ...talk, speakers: cnSpeakers.length };
    });

    return data;
  }, [talksData, speakers]);

  const handleOpenCatalog = () => setOpenCatalog(true);

  const handleCloseCatalog = () => setOpenCatalog(false);

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

  return {
    talks,
    selectedTalk,
    handleTalkChange,
    openCatalog,
    handleOpenCatalog,
    handleCloseCatalog,
  };
};

export default usePublicTalkSelector;
