import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { monthShortNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { addDays, addMonths, getWeekDate, isMondayDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { WeeklySchedulesType, WeekSelectorProps } from './index.types';
import { sourcesState } from '@states/sources';
import { localStorageGetItem } from '@utils/common';
import {
  JWLangState,
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const useWeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const { t } = useAppTranslation();

  const scheduleType = (localStorageGetItem(LOCALSTORAGE_KEY) ||
    'midweek') as WeeklySchedulesType;

  const months = useRecoilValue(monthShortNamesState);
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

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
      let toAdd: number;

      if (scheduleType === 'midweek') {
        toAdd = meetingExactDate ? midweekDay - 1 : 0;
      }

      if (scheduleType === 'weekend') {
        toAdd = weekendDay - 1;
      }

      const meetingDate = addDays(source.weekOf, toAdd);

      const month = meetingDate.getMonth();
      const date = meetingDate.getDate();

      const monthName = months[month];

      return {
        label: t('tr_longDateNoYearLocale', { month: monthName, date }),
        className: defaultValue === index ? 'schedules-current-week' : '',
        Component: <></>,
      };
    });
  }, [
    months,
    t,
    defaultValue,
    scheduleType,
    lang,
    filteredSources,
    midweekDay,
    weekendDay,
    meetingExactDate,
  ]);

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
