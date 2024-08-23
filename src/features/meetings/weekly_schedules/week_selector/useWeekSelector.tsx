import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { monthShortNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { WeekSelectorProps } from './index.types';

const useWeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const months = useRecoilValue(monthShortNamesState);

  const [currentTab, setCurrentTab] = useState<number | boolean>(false);

  const defaultValue = useMemo(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return schedules.findIndex((record) => record.weekOf === weekOf);
  }, [schedules]);

  const weeksTab = useMemo(() => {
    return schedules.map((schedule, index) => {
      const [, month, date] = schedule.weekOf.split('/');
      const monthName = months[+month - 1];

      return {
        label: t('tr_longDateNoYearLocale', { month: monthName, date: +date }),
        className: defaultValue === index ? 'schedules-current-week' : '',
        Component: <></>,
      };
    });
  }, [schedules, months, t, defaultValue]);

  const handleWeekChange = (value: number) => {
    setCurrentTab(value);
    onChange?.(value);
  };

  useEffect(() => {
    if (!value) {
      setCurrentTab(defaultValue);
      onChange?.(defaultValue);
    }

    if (value) {
      setCurrentTab(value);
    }
  }, [value, defaultValue, onChange]);

  return { weeksTab, currentTab, handleWeekChange };
};

export default useWeekSelector;
