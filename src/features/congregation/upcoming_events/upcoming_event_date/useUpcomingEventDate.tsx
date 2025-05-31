import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import { useMemo } from 'react';
import { generateWeekday } from '@services/i18n/translation';

//TODO: Remove this on next PR
let allLocales;
import('date-fns/locale').then((locales) => {
  allLocales = locales;
});

const useUpcomingEventDate = (date: Date) => {
  const { t } = useAppTranslation();
  const weekdays = generateWeekday();

  //TODO: Update and remove allLocales
  const eventDate = useMemo(() => {
    const shortMonth = formatDate(date, 'LLL', {
      locale:
        allLocales && allLocales[t('tr_iso')]
          ? allLocales[t('tr_iso')]
          : undefined,
    });
    const day = formatDate(date, 'd');
    return `${shortMonth}. ${day}`;
  }, [date, t]);

  const eventDay = useMemo(() => {
    const todayIndex = date.getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    return weekdays[adjustedIndex];
  }, [date, weekdays]);

  return {
    eventDate,
    eventDay,
  };
};

export default useUpcomingEventDate;
