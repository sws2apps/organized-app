import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { SourceAssignmentType } from '@definition/sources';
import { JWLangState } from '@states/app';
import { createNumbersArray } from '@utils/common';
import { sourcesCountLC } from '@services/app/sources';
import { userDataViewState } from '@states/settings';

const useLivingPart = (week: string) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const parts = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return [];

    const results: SourceAssignmentType[] = [];
    const count = sourcesCountLC(source, dataView, lang);

    const array = createNumbersArray(count);
    for (const index of array) {
      const partIndex = `lc_part${index}` as SourceAssignmentType;
      results.push(partIndex);
    }

    return results;
  }, [sources, week, dataView, lang]);

  return { parts };
};

export default useLivingPart;
