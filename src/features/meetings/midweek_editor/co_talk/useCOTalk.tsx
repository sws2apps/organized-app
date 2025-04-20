import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { UpdateSpec } from 'dexie';
import { sourcesState } from '@states/sources';
import { COTalkType } from './index.types';
import { COTalkTitleType, SourceWeekType } from '@definition/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useCOTalk = ({ meeting, week, talk }: COTalkType) => {
  const timerSource = useRef<NodeJS.Timeout>();

  const sources = useAtomValue(sourcesState);

  const [talkTitle, setTalkTitle] = useState('');

  const source = sources.find((record) => record.weekOf === week);

  const handleTextChange = (value: string) => setTalkTitle(value);

  const handleTextSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleTextSaveDb, 1000);
  };

  const handleTextSaveDb = async () => {
    let talkField: COTalkTitleType;
    let field: string;

    if (meeting === 'midweek') {
      field = 'midweek_meeting.co_talk_title';
      talkField = structuredClone(source.midweek_meeting.co_talk_title);
    }

    if (meeting === 'weekend') {
      field = `weekend_meeting.co_talk_title.${talk}`;
      talkField = structuredClone(source.weekend_meeting.co_talk_title[talk]);
    }

    talkField.updatedAt = new Date().toISOString();
    talkField.src = talkTitle;

    const data = {
      [field]: talkField,
    } as unknown as UpdateSpec<SourceWeekType>;

    await dbSourcesUpdate(week, data);
  };

  useEffect(() => {
    setTalkTitle('');

    if (source) {
      if (meeting === 'midweek') {
        const talkTitle: COTalkTitleType = source.midweek_meeting.co_talk_title;
        setTalkTitle(talkTitle.src);
      }

      if (meeting === 'weekend') {
        const talkTitle: COTalkTitleType =
          source.weekend_meeting.co_talk_title[talk];
        setTalkTitle(talkTitle.src);
      }
    }
  }, [source, meeting, talk]);

  return { talkTitle, handleTextChange, handleTextSave };
};

export default useCOTalk;
