import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { monthShortNamesState } from '@states/app';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { ScheduleType } from './index.types';
import MidweekMeeting from '../midweek_meeting';

const useWeekSelector = () => {
  const { t } = useAppTranslation();

  const [URLSearchParams] = useSearchParams();

  const currentWeekVisible = useIntersectionObserver({
    root: 'MuiTabs-scroller',
    selector: '.schedules-current-week',
    rootMargin: '0px -150px 0px -150px',
  });

  const schedules = useRecoilValue(schedulesState);
  const months = useRecoilValue(monthShortNamesState);

  const scheduleType = (URLSearchParams.get('type') ||
    'midweek') as ScheduleType;

  const [value, setValue] = useState(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return schedules.findIndex((record) => record.weekOf === weekOf);
  });

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
        Component:
          scheduleType === 'midweek' ? (
            <MidweekMeeting
              week={schedule.weekOf}
              onCurrent={() => {
                setValue(null);
                setTimeout(() => {
                  setValue(defaultValue);
                }, 1000);
              }}
              currentVisible={currentWeekVisible}
            />
          ) : (
            <></>
          ),
      };
    });
  }, [schedules, months, t, defaultValue, currentWeekVisible, scheduleType]);

  const handleWeekChange = (value) => setValue(value);

  return { weeksTab, value, handleWeekChange };
};

export default useWeekSelector;
