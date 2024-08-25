import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { schedulesState } from '@states/schedules';

const useWeekContainer = (week: string) => {
  const { t } = useAppTranslation();

  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [week, schedules]);

  const dateFormatted = useMemo(() => {
    if (!week) return '';

    const [year, month, date] = week.split('/');
    const monthName = monthNames[+month - 1];

    return t('tr_longDateWithYearLocale', { year, month: monthName, date });
  }, [week, monthNames, t]);

  const scheduleIds = useMemo(() => {
    if (!schedule) return [];

    const talks = schedule.weekend_meeting.outgoing_talks
      .filter((record) => record.speaker.length > 0)
      .map((record) => record.id);

    return talks;
  }, [schedule]);

  return { dateFormatted, scheduleIds };
};

export default useWeekContainer;
