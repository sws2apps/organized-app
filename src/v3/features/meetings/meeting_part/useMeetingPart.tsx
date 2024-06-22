import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MeetingPartType } from './index.types';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { userDataViewState } from '@states/settings';

const useMeetingPart = ({ week, type }: MeetingPartType) => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [source, setSource] = useState('');
  const [secondary, setSecondary] = useState<string | null>(null);

  const sourceRecord = sources.find((record) => record.weekOf === week);

  useEffect(() => {
    if (sourceRecord) {
      if (type === 'tgw_talk') {
        const src = sourceRecord.midweek_meeting.tgw_talk[lang];
        const time = t('tr_partDuration', { time: 10 });
        setSource(`${src} ${time}`);
      }

      if (type === 'tgw_gems') {
        const src = sourceRecord.midweek_meeting.tgw_gems[lang];
        const time = t('tr_partDuration', { time: 10 });
        setSource(`${src} ${time}`);
      }

      if (type === 'tgw_bible_reading') {
        const src = sourceRecord.midweek_meeting.tgw_bible_reading.title[lang];
        const time = t('tr_partDuration', { time: 4 });
        setSource(`${src} ${time}`);

        const secondary = sourceRecord.midweek_meeting.tgw_bible_reading.src[lang];
        setSecondary(secondary);
      }

      if (type === 'ayf_part1') {
        const src = sourceRecord.midweek_meeting.ayf_part1.title[lang];
        const time = sourceRecord.midweek_meeting.ayf_part1.time[lang];
        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const secondary = sourceRecord.midweek_meeting.ayf_part1.src[lang];
        setSecondary(secondary);
      }

      if (type === 'ayf_part2') {
        const src = sourceRecord.midweek_meeting.ayf_part2.title[lang];
        const time = sourceRecord.midweek_meeting.ayf_part2.time[lang];
        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const secondary = sourceRecord.midweek_meeting.ayf_part2.src[lang];
        setSecondary(secondary);
      }

      if (type === 'ayf_part3') {
        const src = sourceRecord.midweek_meeting.ayf_part3.title[lang];
        const time = sourceRecord.midweek_meeting.ayf_part3.time[lang];
        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const secondary = sourceRecord.midweek_meeting.ayf_part3.src[lang];
        setSecondary(secondary);
      }

      if (type === 'ayf_part4') {
        const src = sourceRecord.midweek_meeting.ayf_part4.title[lang];
        const time = sourceRecord.midweek_meeting.ayf_part4.time[lang];
        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const secondary = sourceRecord.midweek_meeting.ayf_part4.src[lang];
        setSecondary(secondary);
      }

      if (type === 'lc_part1') {
        const lcPart = sourceRecord.midweek_meeting.lc_part1;

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const src = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride = lcPart.time.override.find((record) => record.type === dataView)?.value;
        const timeDefault = lcPart.time.default[lang];
        const time = titleOverride.length > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value;
        const descDefault = lcPart.desc.default[lang];
        const secondary = titleOverride.length > 0 ? descOverride : descDefault;

        setSecondary(secondary);
      }

      if (type === 'lc_part2') {
        const lcPart = sourceRecord.midweek_meeting.lc_part2;

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const src = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride = lcPart.time.override.find((record) => record.type === dataView)?.value;
        const timeDefault = lcPart.time.default[lang];
        const time = titleOverride.length > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value;
        const descDefault = lcPart.desc.default[lang];
        const secondary = titleOverride.length > 0 ? descOverride : descDefault;

        setSecondary(secondary);
      }

      if (type === 'lc_part3') {
        const lcPart = sourceRecord.midweek_meeting.lc_part3;

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const src = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride = lcPart.time.override.find((record) => record.type === dataView)?.value;
        const timeDefault = lcPart.time.default[lang];
        const time = titleOverride.length > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value;
        const descDefault = lcPart.desc.default[lang];
        const secondary = titleOverride.length > 0 ? descOverride : descDefault;

        setSecondary(secondary);
      }

      if (type === 'lc_cbs') {
        const lcPart = sourceRecord.midweek_meeting.lc_cbs;

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const src = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride = lcPart.time.override.find((record) => record.type === dataView)?.value;
        const timeDefault = lcPart.time.default;
        const time = titleOverride.length > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${src} ${partDuration}`);

        const secondary = lcPart.src[lang];
        setSecondary(secondary);
      }
    }
  }, [sourceRecord, type, lang, t, dataView]);

  return { source, secondary };
};

export default useMeetingPart;
