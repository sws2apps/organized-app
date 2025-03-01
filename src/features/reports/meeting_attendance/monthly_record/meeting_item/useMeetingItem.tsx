import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { createNumbersArray } from '@utils/common';
import { languageGroupsState } from '@states/settings';
import { LanguageGroup, MeetingItemProps } from './index.types';

const useMeetingItem = ({ month, type }: MeetingItemProps) => {
  const { isGroup } = useCurrentUser();

  const languageGroups = useRecoilValue(languageGroupsState);

  const weeksCount = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    // Get the first day of the month
    const firstDay = new Date(year, monthValue - 1, 1);

    // Find the first Monday
    const firstMonday =
      firstDay.getDay() === 1
        ? firstDay
        : new Date(
            year,
            monthValue - 1,
            firstDay.getDate() + ((8 - firstDay.getDay()) % 7)
          );

    // Get the number of days in the month
    const daysInMonth = new Date(year, +monthValue, 0).getDate();

    // Calculate the number of days from the first Monday to the end of the month
    const daysFromFirstMonday = daysInMonth - (firstMonday.getDate() - 1);

    // Calculate the number of weeks
    const weeksFromFirstMonday = Math.ceil(daysFromFirstMonday / 7);

    const result = createNumbersArray(weeksFromFirstMonday);

    return result;
  }, [month]);

  const groups = useMemo(() => {
    const result: LanguageGroup[] = [];

    if (!isGroup) {
      for (const group of languageGroups) {
        if (
          (type === 'midweek' && group.midweek_meeting) ||
          (type === 'weekend' && group.weekend_meeting)
        ) {
          result.push({ id: group.id, name: group.name });
        }
      }
    }

    return result;
  }, [isGroup, languageGroups, type]);

  return { weeksCount, groups };
};

export default useMeetingItem;
