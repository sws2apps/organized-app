import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PartDurationType } from './index.types';
import { createNumbersArray } from '@utils/common';
import { sourcesState } from '@states/sources';
import { JWLangState, userDataViewState } from '@states/settings';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { sourcesPartTiming } from '@services/app/sources';

const usePartDuration = ({ length, type, week }: PartDurationType) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [value, setValue] = useState<number | string>('');

  const options = createNumbersArray(length);

  const handleChangeDuration = async (value: number) => {
    setValue(value);

    const source = sources.find((record) => record.weekOf === week);

    if (type === 'tgw_talk') {
      const part = source.midweek_meeting.tgw_talk.time;

      const timeOverride = structuredClone(part.override);
      const timeDefault = part.default;

      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = timeDefault === value ? undefined : value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.tgw_talk.time.override': timeOverride,
      });
    }

    if (type === 'tgw_gems') {
      const part = source.midweek_meeting.tgw_gems.time;

      const timeOverride = structuredClone(part.override);
      const timeDefault = part.default;

      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = timeDefault === value ? undefined : value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.tgw_gems.time.override': timeOverride,
      });
    }

    if (type === 'lc_part1') {
      const part = source.midweek_meeting.lc_part1.time;

      const timeOverride = structuredClone(part.override);
      const timeDefault = part.default[lang];

      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = timeDefault === value ? undefined : value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part1.time.override': timeOverride,
      });
    }

    if (type === 'lc_part2') {
      const part = source.midweek_meeting.lc_part2.time;

      const timeOverride = structuredClone(part.override);
      const timeDefault = part.default[lang];

      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = timeDefault === value ? undefined : value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part2.time.override': timeOverride,
      });
    }

    if (type === 'lc_part3') {
      const part = source.midweek_meeting.lc_part3.time;
      const timeOverride = structuredClone(part);
      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_part3.time': timeOverride,
      });
    }

    if (type === 'lc_cbs') {
      const part = source.midweek_meeting.lc_cbs.time;

      const timeOverride = structuredClone(part.override);
      const timeDefault = part.default;

      let currentTime = timeOverride.find((record) => record.type === dataView);

      if (!currentTime) {
        timeOverride.push({ value: undefined, type: dataView, updatedAt: '' });
        currentTime = timeOverride.find((record) => record.type === dataView);
      }

      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = timeDefault === value ? undefined : value;

      await dbSourcesUpdate(week, {
        'midweek_meeting.lc_cbs.time.override': timeOverride,
      });
    }
  };

  useEffect(() => {
    if (week.length > 0) {
      const source = sources.find((record) => record.weekOf === week);

      const time = sourcesPartTiming(source, type, dataView, lang);

      setValue(time || 5);
    }
  }, [type, week, sources, lang, dataView]);

  return { options, handleChangeDuration, value };
};

export default usePartDuration;
