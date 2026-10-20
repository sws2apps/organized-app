import {
  eachWeekOfInterval,
  format,
  isValid,
  parse,
  startOfWeek,
} from 'date-fns';

export const hallCleaningPlanningWeeks = (
  start: string,
  today = new Date()
) => {
  const rotationStart = parse(start, 'yyyy/MM/dd', today);
  if (!isValid(rotationStart)) return [];
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const first = rotationStart > currentWeek ? rotationStart : currentWeek;
  const serviceYear = first.getFullYear() + (first.getMonth() >= 8 ? 1 : 0);
  const calendarEnd = new Date(first.getFullYear() + 1, 11, 31);
  const serviceEnd = new Date(serviceYear + 1, 7, 31);
  const end = calendarEnd > serviceEnd ? calendarEnd : serviceEnd;
  return eachWeekOfInterval({ start: first, end }, { weekStartsOn: 1 }).map(
    (week) => format(week, 'yyyy/MM/dd')
  );
};
