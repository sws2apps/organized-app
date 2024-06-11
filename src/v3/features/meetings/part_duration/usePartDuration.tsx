import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PartDurationType } from './index.types';
import { createNumbersArray } from '@utils/common';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/app';
import { userDataViewState } from '@states/settings';

const usePartDuration = ({ length, type, week }: PartDurationType) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [value, setValue] = useState<number | string>('');

  const options = createNumbersArray(length);

  const handleChangeDuration = async (value: number) => {
    setValue(value);
  };

  useEffect(() => {
    if (week.length > 0) {
      const source = sources.find((record) => record.weekOf === week);

      if (type === 'tgw_talk') {
        const part = source.midweek_meeting.tgw_talk;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }

      if (type === 'tgw_gems') {
        const part = source.midweek_meeting.tgw_gems;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }

      if (type === 'lc_part1') {
        const part = source.midweek_meeting.lc_part1;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default[lang];
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }

      if (type === 'lc_part2') {
        const part = source.midweek_meeting.lc_part2;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default[lang];
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }

      if (type === 'lc_part3') {
        const part = source.midweek_meeting.lc_part3;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default[lang];
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }

      if (type === 'lc_cbs') {
        const part = source.midweek_meeting.lc_cbs;
        const timeOverride = part.time.override.find((record) => record.type === dataView)?.value || 0;
        const timeDefault = part.time.default;
        const time = timeOverride > 0 ? timeOverride : timeDefault;

        setValue(time);
      }
    }
  }, [type, week, sources, lang, dataView]);

  return { options, handleChangeDuration, value };
};

export default usePartDuration;
