import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import { GroupBadgeProps } from '@components/group_badge/index.types';

export type MonthViewProps = {
  meetings: FieldServiceMeetingFormattedType[];
  onSelectDay: (date: Date) => void;
};

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
