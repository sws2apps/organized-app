import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/settings';
import { MinistryContainerProps } from './index.types';
import { createNumbersArray } from '@utils/common';

const useMinistryContainer = ({ selectedWeek }: MinistryContainerProps) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const count = useMemo(() => {
    if (!source) return 0;

    return source.midweek_meeting.ayf_count[lang];
  }, [source, lang]);

  const countArray = useMemo(() => {
    return createNumbersArray(count);
  }, [count]);

  return { countArray };
};

export default useMinistryContainer;
