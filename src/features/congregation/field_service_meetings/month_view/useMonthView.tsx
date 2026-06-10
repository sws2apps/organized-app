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

export type MonthBadge = {
  label: string;
  color: GroupBadgeProps['color'];
};

export type MonthDayCell = {
  date: Date;
  dateStr: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  badges: MonthBadge[];
};

const useMonthView = (meetings: FieldServiceMeetingFormattedType[]) => {
  const { t } = useAppTranslation();
  const referenceDate = useAtomValue(fieldServiceMeetingsWeekRangeState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const weekdayLabels = useMemo(() => generateWeekday(), []);

  const colorForGroup = useMemo(() => {
    return (groupId?: string): GroupBadgeProps['color'] => {
      const group = groups.find((item) => item.group_id === groupId);
      if (!group) return 'accent-main';
      const index = (group.group_data.sort_index % 10) + 1;
      return `group-${index}` as GroupBadgeProps['color'];
    };
  }, [groups]);

  // Badge label: group name when set, otherwise just "Group N"; joint/service
  // overseer meetings use their category name. Keeps cells compact.
  const labelForMeeting = useMemo(() => {
    return (meeting: FieldServiceMeetingFormattedType): string => {
      if (meeting.category === FieldServiceMeetingCategory.JointMeeting) {
        return t('tr_fieldServiceMeetingCategory_joint');
      }
      if (meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting) {
        return t('tr_fieldServiceMeetingCategory_serviceOverseer');
      }
      const group = groups.find((item) => item.group_id === meeting.group_id);
      if (group) {
        const name = group.group_data.name?.trim();
        return name || `${t('tr_group')} ${group.group_data.sort_index + 1}`;
      }
      return meeting.groupName ?? '';
    };
  }, [groups, t]);

  const meetingsByDay = useMemo(() => {
    const map = new Map<string, MonthBadge[]>();
    for (const meeting of meetings) {
      const dateStr = formatDate(new Date(meeting.startISO), 'yyyy/MM/dd');
      const color =
        meeting.category === FieldServiceMeetingCategory.RegularMeeting
          ? colorForGroup(meeting.group_id)
          : 'accent-main';

      const existing = map.get(dateStr) ?? [];
      existing.push({ label: labelForMeeting(meeting), color });
      map.set(dateStr, existing);
    }
    return map;
  }, [meetings, colorForGroup, labelForMeeting]);

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
