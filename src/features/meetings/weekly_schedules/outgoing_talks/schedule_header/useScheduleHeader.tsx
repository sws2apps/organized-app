import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { monthShortNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useScheduleHeader = () => {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const monthNames = useAtomValue(monthShortNamesState);

  const scheduleLastUpdated = useMemo(() => {
    const dates: string[] = [];

    for (const schedule of schedules) {
      for (const talk of schedule.weekend_meeting.outgoing_talks) {
        if (talk.updatedAt.length > 0) {
          dates.push(talk.updatedAt);
        }
      }
    }

    const recentDate = dates.sort((a, b) => b.localeCompare(a)).at(0);
    if (!recentDate) return;

    const d = new Date(recentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const monthName = monthNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedules, monthNames, t]);

  return { scheduleLastUpdated };
};

export default useScheduleHeader;
