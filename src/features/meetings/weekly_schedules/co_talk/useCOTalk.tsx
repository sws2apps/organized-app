import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { COTalkType } from './index.types';
import { COTalkTitleType } from '@definition/sources';
import { useAppTranslation } from '@hooks/index';

const useCOTalk = ({ meeting, week, talk }: COTalkType) => {
  const { t } = useAppTranslation();

  const sources = useAtomValue(sourcesState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const title = useMemo(() => {
    if (!source) return;

    let src: string;

    if (meeting === 'midweek') {
      const talkTitle: COTalkTitleType = source.midweek_meeting.co_talk_title;
      src = talkTitle.src;
    }

    if (meeting === 'weekend') {
      const talkTitle: COTalkTitleType =
        source.weekend_meeting.co_talk_title[talk];
      src = talkTitle.src;
    }

    src += ` (30 ${t('tr_minLabel')})`;

    return src;
  }, [source, meeting, talk, t]);

  return { title };
};

export default useCOTalk;
