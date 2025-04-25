import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';

const useMonthContainer = (month: string) => {
  const monthnames = useAtomValue(monthNamesState);

  const monthLocale = useMemo(() => {
    const [varYear, varMonth] = month.split('/');
    const monthLocale = monthnames[+varMonth - 1];

    return `${monthLocale} ${varYear}`;
  }, [monthnames, month]);

  return { monthLocale };
};

export default useMonthContainer;
