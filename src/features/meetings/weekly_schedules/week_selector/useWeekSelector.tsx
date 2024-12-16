import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { JWLangState, monthShortNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { addMonths, getWeekDate, isMondayDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { WeeklySchedulesType, WeekSelectorProps } from './index.types';
import { sourcesState } from '@states/sources';
import { localStorageGetItem } from '@utils/common';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const useWeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const { t } = useAppTranslation();

  const scheduleType = (localStorageGetItem(LOCALSTORAGE_KEY) ||
    'midweek') as WeeklySchedulesType;

  const months = useRecoilValue(monthShortNamesState);
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);

  const [currentTab, setCurrentTab] = useState<number | boolean>(false);

  const filteredSources = useMemo(() => {
    const minDate = formatDate(addMonths(new Date(), -2), 'yyyy/MM/dd');

    return sources.filter(
      (record) => isMondayDate(record.weekOf) && record.weekOf >= minDate
    );
  }, [sources]);

  const defaultValue = useMemo(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return filteredSources.findIndex((record) => record.weekOf === weekOf);
  }, [filteredSources]);

  const weeksTab = useMemo(() => {
    let weeksList = structuredClone(filteredSources);

    if (scheduleType === 'midweek') {
      weeksList = weeksList.filter(
        (record) => record.midweek_meeting.week_date_locale[lang]?.length > 0
      );
    }

    return weeksList.map((source, index) => {
      const [, month, date] = source.weekOf.split('/');
      const monthName = months[+month - 1];

      return {
        label: t('tr_longDateNoYearLocale', { month: monthName, date: +date }),
        className: defaultValue === index ? 'schedules-current-week' : '',
        Component: <></>,
      };
    });
  }, [months, t, defaultValue, scheduleType, lang, filteredSources]);

  const handleWeekChange = (value: number) => {
    setCurrentTab(value);
    onChange?.(value);
  };

  useEffect(() => {
    if (value === false) {
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
