import { AssignmentCode } from '@definition/assignment';
import { AppRoleType } from '@definition/app';
import {
  HallAttendantPerson,
  HallMeeting,
  HallMeetingDates,
} from '@definition/hall_attendant';
import { addDays, formatDate, getWeekDate, weeksInMonth } from '@utils/date';

export const isHallAttendant = (
  person: HallAttendantPerson | undefined,
  dataView?: string,
  roles: AppRoleType[] = []
) =>
  !!person &&
  !person._deleted?.value &&
  person.person_data?.male?.value === true &&
  person.person_data.archived?.value !== true &&
  person.person_data.disqualified?.value !== true &&
  ((person.person_data.archived?.value === false &&
    person.person_data.disqualified?.value === false) ||
    roles.includes('hall_attendant')) &&
  Array.isArray(person.person_data.assignments) &&
  person.person_data.assignments.some(
    (record) =>
      (dataView === undefined || record.type === dataView) &&
      record.values?.includes(AssignmentCode.DUTIES_HallAttendant)
  );

export const getHallMeeting = (
  today: Date,
  midweekDay: number,
  weekendDay: number,
  dates: HallMeetingDates = {}
): HallMeeting => {
  const weekDate = getWeekDate(new Date(today));
  const midnight = new Date(today);
  midnight.setHours(0, 0, 0, 0);
  const candidates = (['midweek', 'weekend'] as const)
    .map((type) => {
      const override = dates[type];
      const date =
        override && Number.isFinite(override.getTime())
          ? new Date(override)
          : addDays(weekDate, type === 'midweek' ? midweekDay : weekendDay);
      date.setHours(0, 0, 0, 0);
      return { type, date };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const selected =
    candidates.find((item) => item.date >= midnight) ??
    candidates[candidates.length - 1];
  const week = formatDate(weekDate, 'yyyy/MM/dd');
  const month = formatDate(weekDate, 'yyyy/MM');
  return {
    week,
    month,
    index: weeksInMonth(month).indexOf(week) + 1,
    ...selected,
  };
};
