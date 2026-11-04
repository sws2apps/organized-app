import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { UpdateSpec } from 'dexie';
import { COTalkTitleType, SourceWeekType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { MeetingFieldsProps, TalkField } from './index.types';

const TALK_UPDATES: Record<
  TalkField,
  (talk: COTalkTitleType) => UpdateSpec<SourceWeekType>
> = {
  midweek: (talk) => ({ 'midweek_meeting.co_talk_title': talk }),
  public: (talk) => ({ 'weekend_meeting.co_talk_title.public': talk }),
  service: (talk) => ({ 'weekend_meeting.co_talk_title.service': talk }),
};

const useMeetingFields = ({ meeting, weekOf }: MeetingFieldsProps) => {
  const sources = useAtomValue(sourcesState);

  const source = sources.find((record) => record.weekOf === weekOf);

  const timers = useRef<Partial<Record<TalkField, NodeJS.Timeout>>>({});

  const [talks, setTalks] = useState<Record<TalkField, string>>({
    midweek: '',
    public: '',
    service: '',
  });

  const talkFields: TalkField[] =
    meeting === 'midweek' ? ['midweek'] : ['public', 'service'];

  const handleTalkChange = (field: TalkField, value: string) => {
    setTalks((prev) => ({ ...prev, [field]: value }));

    clearTimeout(timers.current[field]);

    timers.current[field] = setTimeout(async () => {
      timers.current[field] = undefined;

      await dbSourcesUpdate(
        weekOf,
        TALK_UPDATES[field]({
          src: value,
          updatedAt: new Date().toISOString(),
        })
      );
    }, 1000);
  };

  useEffect(() => {
    if (!source) return;

    const values = {
      midweek: source.midweek_meeting.co_talk_title.src,
      public: source.weekend_meeting.co_talk_title.public.src,
      service: source.weekend_meeting.co_talk_title.service.src,
    };

    setTalks((prev) => {
      const next = { ...prev };

      for (const field of Object.keys(values) as TalkField[]) {
        if (!timers.current[field]) next[field] = values[field];
      }

      return next;
    });
  }, [source]);

  return { hasSource: Boolean(source), talks, talkFields, handleTalkChange };
};

export default useMeetingFields;
