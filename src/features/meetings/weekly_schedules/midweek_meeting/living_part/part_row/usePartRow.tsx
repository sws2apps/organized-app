import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ApplyMinistryType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import { PartRowProps } from './index.types';
import { JWLangState } from '@states/app';

const usePartRow = ({ type, week }: PartRowProps) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);

  const ayfType = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return;

    const ayfField = type.toString();

    const ayf = source.midweek_meeting[ayfField] as ApplyMinistryType;
    return ayf.type[lang];
  }, [sources, week, lang, type]);

  return { ayfType };
};

export default usePartRow;
