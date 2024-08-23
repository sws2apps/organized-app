import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { monthShortNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { WeeklySchedulesType, WeekSelectorProps } from './index.types';
import { sourcesState } from '@states/sources';

const useWeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const { t } = useAppTranslation();

  const [searchParams] = useSearchParams();

  const scheduleType = (searchParams.get('type') ||
    'midweek') as WeeklySchedulesType;

  const months = useRecoilValue(monthShortNamesState);
  const sources = useRecoilValue(sourcesState);

  const [currentTab, setCurrentTab] = useState<number | boolean>(false);

  const defaultValue = useMemo(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return sources.findIndex((record) => record.weekOf === weekOf);
  }, [sources]);

  const weeksTab = useMemo(() => {
    let filteredSources = structuredClone(sources);

    if (scheduleType === 'midweek') {
      filteredSources = filteredSources.filter(
        (record) => record.midweek_meeting.week_date_locale['E']?.length > 0
      );
    }

    return filteredSources.map((source, index) => {
      const [, month, date] = source.weekOf.split('/');
      const monthName = months[+month - 1];

      return {
        label: t('tr_longDateNoYearLocale', { month: monthName, date: +date }),
        className: defaultValue === index ? 'schedules-current-week' : '',
        Component: <></>,
      };
    });
  }, [sources, months, t, defaultValue, scheduleType]);

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
