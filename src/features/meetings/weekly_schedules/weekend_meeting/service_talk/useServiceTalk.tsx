import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';

const useServiceTalk = (week: string) => {
  const sources = useAtomValue(sourcesState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const talkTitle = useMemo(() => {
    if (!source) return;

    return source.weekend_meeting.co_talk_title.service.src;
  }, [source]);

  return { talkTitle };
};

export default useServiceTalk;
