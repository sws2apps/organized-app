import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { dayNamesState, monthShortNamesState } from '@states/app';

const useUpcomingEventDate = (date: Date) => {
  const { t } = useAppTranslation();

  const weekdays = useAtomValue(dayNamesState);
  const months = useAtomValue(monthShortNamesState);

  const eventDate = useMemo(() => {
    const dateV = date.getDate();
    const monthIndex = date.getMonth();

    const month = months[monthIndex];

    return t('tr_longDateNoYearLocale', { month, date: dateV });
  }, [months, date, t]);

  const eventDay = useMemo(() => {
    const todayIndex = date.getDay();
    return weekdays[todayIndex];
  }, [date, weekdays]);

  return { eventDate, eventDay };
};

export default useUpcomingEventDate;
