import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { addMonths, formatDate, getWeekDate, isMondayDate } from '@utils/date';
import { WeeklySchedulesType, WeekSelectorProps } from './index.types';
import { sourcesState } from '@states/sources';
import { localStorageGetItem } from '@utils/common';
import { JWLangState } from '@states/settings';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const useWeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const scheduleType = (localStorageGetItem(LOCALSTORAGE_KEY) ||
    'midweek') as WeeklySchedulesType;

  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);

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
        (record) => record.midweek_meeting?.week_date_locale[lang]?.length > 0
      );
    }

    return weeksList.map((source, index) => {
      const meetingDate = schedulesGetMeetingDate({
        week: source.weekOf,
        meeting: scheduleType,
        short: true,
      });

      return {
        label: meetingDate.locale,
        className: defaultValue === index ? 'schedules-current-week' : '',
        Component: <></>,
      };
    });
  }, [defaultValue, scheduleType, lang, filteredSources]);

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
