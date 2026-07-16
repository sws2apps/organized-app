import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { fieldServiceMeetingsWeekRangeState } from '@states/field_service_meetings';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';
import { GroupBadgeProps } from '@components/group_badge/index.types';
import { generateWeekday } from '@services/i18n/translation';
import { formatDate } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { resolveGroupBadgeColor } from '../group_badge_color';
import { MonthBadge, MonthDayCell } from './index.types';

const useMonthView = (meetings: FieldServiceMeetingFormattedType[]) => {
  const { t } = useAppTranslation();
  const referenceDate = useAtomValue(fieldServiceMeetingsWeekRangeState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  // Not memoized: the labels are locale-derived and must refresh when the app
  // language changes (matching the other generateWeekday consumers).
  const weekdayLabels = generateWeekday();

  // Badge label: group name when set, otherwise "Group N" (both pre-computed
  // as `groupName`); joint/service overseer meetings use their category name.
  const labelForMeeting = useMemo(() => {
    return (meeting: FieldServiceMeetingFormattedType): string => {
      if (meeting.category === FieldServiceMeetingCategory.JointMeeting) {
        return t('tr_fieldServiceMeetingCategory_joint');
      }
      if (
        meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting
      ) {
        return t('tr_fieldServiceMeetingCategory_serviceOverseer');
      }
      return meeting.groupName ?? '';
    };
  }, [t]);

  const meetingsByDay = useMemo(() => {
    const map = new Map<string, MonthBadge[]>();
    for (const meeting of meetings) {
      const dateStr = formatDate(new Date(meeting.startISO), 'yyyy/MM/dd');
      const color: GroupBadgeProps['color'] =
        meeting.category === FieldServiceMeetingCategory.RegularMeeting
          ? resolveGroupBadgeColor(groups, meeting.group_id)
          : 'accent-main';

      const existing = map.get(dateStr) ?? [];
      existing.push({ label: labelForMeeting(meeting), color });
      map.set(dateStr, existing);
    }
    return map;
  }, [meetings, groups, labelForMeeting]);

  const weeks = useMemo(() => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    // Monday-first offset for the 1st of the month.
    const leadingOffset = (firstOfMonth.getDay() + 6) % 7;
    const totalCells = leadingOffset + lastOfMonth.getDate();
    const weekCount = Math.ceil(totalCells / 7);

    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - leadingOffset);

    const todayStr = formatDate(new Date(), 'yyyy/MM/dd');

    const result: MonthDayCell[][] = [];
    for (let week = 0; week < weekCount; week++) {
      const days: MonthDayCell[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(start);
        date.setDate(start.getDate() + week * 7 + day);
        const dateStr = formatDate(date, 'yyyy/MM/dd');

        const jsDay = date.getDay(); // 0 = Sun, 6 = Sat
        days.push({
          date,
          dateStr,
          dayNumber: date.getDate(),
          inMonth: date.getMonth() === month,
          isToday: dateStr === todayStr,
          isWeekend: jsDay === 0 || jsDay === 6,
          badges: meetingsByDay.get(dateStr) ?? [],
        });
      }
      result.push(days);
    }
    return result;
  }, [referenceDate, meetingsByDay]);

  return { weeks, weekdayLabels };
};

export default useMonthView;
