import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { createNumbersArray } from '@utils/common';
import { languageGroupEnabledState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import { LanguageGroup, MeetingItemProps } from './index.types';

const useMeetingItem = ({ month, type }: MeetingItemProps) => {
  const { isGroup } = useCurrentUser();

  const languageGroups = useAtomValue(languageGroupsState);
  const languageGroupEnabled = useAtomValue(languageGroupEnabledState);

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

    if (languageGroupEnabled && !isGroup) {
      for (const group of languageGroups) {
        if (
          (type === 'midweek' && group.group_data.midweek_meeting) ||
          (type === 'weekend' && group.group_data.weekend_meeting)
        ) {
          result.push({ id: group.group_id, name: group.group_data.name });
        }
      }
    }

    return result;
  }, [isGroup, languageGroups, type, languageGroupEnabled]);

  return { weeksCount, groups };
};

export default useMeetingItem;
