import { ReactNode } from 'react';

export type MonthCalendarDay = {
  date: Date;
  dateStr: string;
  dayNumber: number;
  /**
   * False for the neighbouring-month days that pad the first and last week.
   */
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
};

export type MonthCalendarProps = {
  /**
   * Full weeks of the displayed month, padded with the neighbouring-month
   * days.
   */
  weeks: MonthCalendarDay[][];
  /**
   * Weekday headers, in the same order as the columns.
   */
  weekdayLabels: string[];
  /**
   * Content rendered under the day number — badges, counts, anything.
   */
  renderDay?: (day: MonthCalendarDay) => ReactNode;
  /**
   * Days that answer false are rendered inert (no pointer, no focus).
   * Defaults to every in-month day being selectable.
   */
  isDaySelectable?: (day: MonthCalendarDay) => boolean;
  onSelectDay?: (day: MonthCalendarDay) => void;
  dayAriaLabel?: (day: MonthCalendarDay) => string;
  /**
   * Tints Saturdays and Sundays.
   */
  highlightWeekends?: boolean;
};
