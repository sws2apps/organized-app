import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/settings';
import { MinistryContainerProps } from './index.types';
import { createNumbersArray } from '@utils/common';

const useMinistryContainer = ({ selectedWeek }: MinistryContainerProps) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const count = useMemo(() => {
    return source.midweek_meeting.ayf_count[lang];
  }, [source, lang]);

  const countArray = useMemo(() => {
    return createNumbersArray(count);
  }, [count]);

  return { countArray };
};

export default useMinistryContainer;
