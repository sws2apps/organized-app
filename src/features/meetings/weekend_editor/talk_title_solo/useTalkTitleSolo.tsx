import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { TalkTitleSoloType } from './index.types';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useTalkTitleSolo = ({ type, week }: TalkTitleSoloType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);

  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);

  const [title, setTitle] = useState('');

  const source = sources.find((record) => record.weekOf === week);

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleTitleSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleTitleSaveDb, 1000);
  };

  const handleTitleSaveDb = async () => {
    if (type === 'public_talk') {
      const talk = structuredClone(source.weekend_meeting.public_talk);

      let localTalk = talk.find((record) => record.type === dataView);
      if (!localTalk) {
        talk.push({ type: dataView, updatedAt: '', value: '' });
        localTalk = talk.find((record) => record.type === dataView);
      }

      localTalk.updatedAt = new Date().toISOString();
      localTalk.value = title;

      await dbSourcesUpdate(week, { 'weekend_meeting.public_talk': talk });
    }

    if (type === 'co_public_talk') {
      const talk = structuredClone(source.weekend_meeting.co_talk_title.public);

      talk.updatedAt = new Date().toISOString();
      talk.src = title;

      await dbSourcesUpdate(week, {
        'weekend_meeting.co_talk_title.public': talk,
      });
    }

    if (type === 'co_service_talk') {
      const talk = structuredClone(
        source.weekend_meeting.co_talk_title.service
      );

      talk.updatedAt = new Date().toISOString();
      talk.src = title;

      await dbSourcesUpdate(week, {
        'weekend_meeting.co_talk_title.service': talk,
      });
    }
  };

  useEffect(() => {
    if (source) {
      if (type === 'public_talk') {
        const talk =
          source.weekend_meeting.public_talk.find(
            (record) => record.type === dataView
          )?.value || '';
        setTitle(talk as string);
      }

      if (type === 'co_public_talk') {
        const talk = source.weekend_meeting.co_talk_title.public.src;
        setTitle(talk);
      }

      if (type === 'co_service_talk') {
        const talk = source.weekend_meeting.co_talk_title.service.src;
        setTitle(talk);
      }
    }
  }, [source, type, dataView]);

  return { title, handleTitleChange, handleTitleSave };
};

export default useTalkTitleSolo;
