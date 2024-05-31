import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useWeekItem = (week: string) => {
  const { t } = useAppTranslation();

  const monthNames = useRecoilValue(monthNamesState);

  const weekDate = new Date(week);
  const month = weekDate.getMonth();
  const date = weekDate.getDate();

  const monthName = monthNames[month];

  const weekDateLocale = t('tr_longDateNoYearLocale', { date, month: monthName });

  return { weekDateLocale };
};

export default useWeekItem;
