import { useRecoilState, useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';

const useWeekItem = (week: string) => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useRecoilState(selectedWeekState);

  const monthNames = useRecoilValue(monthNamesState);

  const weekDate = new Date(week);
  const month = weekDate.getMonth();
  const date = weekDate.getDate();

  const monthName = monthNames[month];

  const weekDateLocale = t('tr_longDateNoYearLocale', { date, month: monthName });

  const handleSelectWeek = (value: string) => setSelectedWeek(value);

  const isSelected = week === selectedWeek;

  return { weekDateLocale, handleSelectWeek, isSelected };
};

export default useWeekItem;
