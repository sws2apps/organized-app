import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MeetingPartType } from './index.types';
import { sourcesState } from '@states/sources';
import { useAppTranslation } from '@hooks/index';
import { JWLangState, userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useMeetingPart = ({ week, type }: MeetingPartType) => {
  const { t } = useAppTranslation();

  const timerSource = useRef<NodeJS.Timeout>();

  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [source, setSource] = useState('');
  const [secondary, setSecondary] = useState<string | null>(null);
  const [sourceOverwrite, setSourceOverwrite] = useState('');
  const [secondaryOverwrite, setSecondaryOverwrite] = useState('');
  const [timeOverwrite, setTimeOverwrite] = useState<number | string>('');

  const sourceRecord = sources.find((record) => record.weekOf === week);

  const handleSourceOverwriteChange = (value: string) => {
    setSourceOverwrite(value);
  };

  const handleSourceOverwriteSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleSourceOverwriteSaveDb, 1000);
  };

  const handleSourceOverwriteSaveDb = async () => {
    if (type === 'lc_part1') {
      const lcPartTitle = structuredClone(
        sourceRecord.midweek_meeting.lc_part1.title.override
      );
      const current = lcPartTitle.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part1.title.override': lcPartTitle,
      });

      // check if time is still empty
      const lcPartTime = structuredClone(
        sourceRecord.midweek_meeting.lc_part1.time.override
      );
      const currentTime = lcPartTime.find((record) => record.type === dataView);
      if (!currentTime.value || currentTime.value === 0) {
        currentTime.updatedAt = new Date().toISOString();
        currentTime.value = +timeOverwrite;

        await dbSourcesUpdate(week, {
          'midweek_meeting.lc_part1.time.override': lcPartTime,
        });
      }
    }

    if (type === 'lc_part2') {
      const lcPartTitle = structuredClone(
        sourceRecord.midweek_meeting.lc_part2.title.override
      );
      const current = lcPartTitle.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part2.title.override': lcPartTitle,
      });

      // check if time is still empty
      const lcPartTime = structuredClone(
        sourceRecord.midweek_meeting.lc_part2.time.override
      );
      const currentTime = lcPartTime.find((record) => record.type === dataView);
      if (!currentTime.value || currentTime.value === 0) {
        currentTime.updatedAt = new Date().toISOString();
        currentTime.value = +timeOverwrite;

        await dbSourcesUpdate(week, {
          'midweek_meeting.lc_part2.time.override': lcPartTime,
        });
      }
    }

    if (type === 'lc_part3') {
      const lcPartTitle = structuredClone(
        sourceRecord.midweek_meeting.lc_part3.title
      );
      const current = lcPartTitle.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part3.title': lcPartTitle,
      });
    }

    if (type === 'lc_cbs') {
      const lcCBSTitle = structuredClone(
        sourceRecord.midweek_meeting.lc_cbs.title.override
      );
      const current = lcCBSTitle.find((record) => record.type === dataView);

      if (!current) {
        lcCBSTitle.push({
          type: dataView,
          updatedAt: new Date().toISOString(),
          value: sourceOverwrite,
        });
      }

      if (current) {
        current.value = new Date().toISOString();
        current.value = source === sourceOverwrite ? '' : sourceOverwrite;
      }

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_cbs.title.override': lcCBSTitle,
      });
    }
  };

  const handleSecondaryOverwriteChange = (value: string) => {
    setSecondaryOverwrite(value);
  };

  const handleSecondaryOverwriteSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(handleSecondaryOverwriteSaveDb, 1000);
  };

  const handleSecondaryOverwriteSaveDb = async () => {
    if (type === 'lc_part1') {
      const lcPartDesc = structuredClone(
        sourceRecord.midweek_meeting.lc_part1.desc.override
      );
      const current = lcPartDesc.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part1.desc.override': lcPartDesc,
      });
    }

    if (type === 'lc_part2') {
      const lcPartDesc = structuredClone(
        sourceRecord.midweek_meeting.lc_part2.desc.override
      );
      const current = lcPartDesc.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part2.desc.override': lcPartDesc,
      });
    }

    if (type === 'lc_part3') {
      const lcPartDesc = structuredClone(
        sourceRecord.midweek_meeting.lc_part3.desc
      );
      const current = lcPartDesc.find((record) => record.type === dataView);
      current.value = new Date().toISOString();
      current.value = sourceOverwrite;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part3.desc': lcPartDesc,
      });
    }
  };

  useEffect(() => {
    if (sourceRecord) {
      if (type === 'tgw_talk') {
        const part = sourceRecord.midweek_meeting.tgw_talk;
        const src = part.src[lang];

        const timeOverride =
          part.time.override.find((record) => record.type === dataView)
            ?.value || 0;
        const timeDefault = part.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });

        setSource(`${src} ${partDuration}`);
      }

      if (type === 'tgw_gems') {
        const part = sourceRecord.midweek_meeting.tgw_gems;
        const title = part.title[lang];

        const timeOverride =
          part.time.override.find((record) => record.type === dataView)
            ?.value || 0;
        const timeDefault = part.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });

        setSource(`${title} ${partDuration}`);
      }

      if (type === 'tgw_bible_reading') {
        const src = sourceRecord.midweek_meeting.tgw_bible_reading.title[lang];
        const time = t('tr_partDuration', { time: 4 });
        setSource(`${src} ${time}`);

        const secondary =
          sourceRecord.midweek_meeting.tgw_bible_reading.src[lang];
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

        const titleOverride =
          lcPart.title.override.find((record) => record.type === dataView)
            ?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const title = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride =
          lcPart.time.override.find((record) => record.type === dataView)
            ?.value || 0;
        const timeDefault = lcPart.time.default[lang];
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${title} ${partDuration}`);
        setSourceOverwrite(titleOverride);
        setTimeOverwrite(time === 0 ? '' : time);

        const descOverride =
          lcPart.desc.override.find((record) => record.type === dataView)
            ?.value || '';
        const descDefault = lcPart.desc.default[lang];
        const secondary = titleOverride.length > 0 ? descOverride : descDefault;

        setSecondary(secondary);
        setSecondaryOverwrite(descOverride);
      }

      if (type === 'lc_part2') {
        const lcPart = sourceRecord.midweek_meeting.lc_part2;

        const titleOverride =
          lcPart.title.override.find((record) => record.type === dataView)
            ?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const title = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride =
          lcPart.time.override.find((record) => record.type === dataView)
            ?.value || 0;
        const timeDefault = lcPart.time.default[lang];
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${title} ${partDuration}`);
        setSourceOverwrite(titleOverride);
        setTimeOverwrite(time === 0 ? '' : time);

        const descOverride =
          lcPart.desc.override.find((record) => record.type === dataView)
            ?.value || '';
        const descDefault = lcPart.desc.default[lang];
        const secondary = titleOverride.length > 0 ? descOverride : descDefault;

        setSecondary(secondary);
        setSecondaryOverwrite(descOverride);
      }

      if (type === 'lc_part3') {
        const lcPart = sourceRecord.midweek_meeting.lc_part3;

        const title =
          lcPart.title.find((record) => record.type === dataView)?.value || '';
        const time =
          lcPart.time.find((record) => record.type === dataView)?.value || 0;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${title} ${partDuration}`);
        setSourceOverwrite(title);
        setTimeOverwrite(time === 0 ? '' : time);

        const secondary =
          lcPart.desc.find((record) => record.type === dataView)?.value || '';
        setSecondary(secondary);
        setSecondaryOverwrite(secondary);
      }

      if (type === 'lc_cbs') {
        const lcPart = sourceRecord.midweek_meeting.lc_cbs;

        const titleOverride =
          lcPart.title.override.find((record) => record.type === dataView)
            ?.value || '';
        const titleDefault = lcPart.title.default[lang];
        const title = titleOverride.length > 0 ? titleOverride : titleDefault;

        const timeOverride =
          lcPart.time.override.find((record) => record.type === dataView)
            ?.value || 0;
        const timeDefault = lcPart.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        const partDuration = t('tr_partDuration', { time: time });
        setSource(`${title} ${partDuration}`);
        setSourceOverwrite(title);

        const secondary = lcPart.src[lang];
        setSecondary(secondary);
      }
    }
  }, [sourceRecord, type, lang, t, dataView]);

  return {
    source,
    secondary,
    sourceOverwrite,
    secondaryOverwrite,
    handleSourceOverwriteSave,
    handleSourceOverwriteChange,
    handleSecondaryOverwriteChange,
    handleSecondaryOverwriteSave,
  };
};

export default useMeetingPart;
