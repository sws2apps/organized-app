import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { SourceAssignmentType } from '@definition/sources';
import { createNumbersArray } from '@utils/common';
import { JWLangState } from '@states/settings';

const useMinistryPart = (week: string) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);

  const parts = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return [];

    const results: SourceAssignmentType[] = [];
    const count = source.midweek_meeting.ayf_count[lang];

    const array = createNumbersArray(count);
    for (const index of array) {
      const partIndex = `ayf_part${index}` as SourceAssignmentType;
      results.push(partIndex);
    }

    return results;
  }, [sources, week, lang]);

  return { parts };
};

export default useMinistryPart;
