import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useWeekContainer = (dateGroup: string) => {
  const { t } = useAppTranslation();

  const monthNames = useAtomValue(monthNamesState);

  const dateFormatted = useMemo(() => {
    if (!dateGroup) return '';

    const [year, month, date] = dateGroup.split('/');
    const monthName = monthNames[+month - 1];

    return t('tr_longDateWithYearLocale', { year, month: monthName, date });
  }, [dateGroup, monthNames, t]);

  return { dateFormatted };
};

export default useWeekContainer;
