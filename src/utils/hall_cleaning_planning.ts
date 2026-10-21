import {
  eachWeekOfInterval,
  format,
  isValid,
  parse,
  startOfWeek,
} from 'date-fns';

export const hallCleaningDefaultEndWeek = (
  start: string,
  today = new Date()
) => {
  const parsed = parse(start, 'yyyy/MM/dd', today);
  const year = isValid(parsed)
    ? Math.max(parsed.getFullYear(), today.getFullYear())
    : today.getFullYear();
  return format(
    startOfWeek(new Date(year, 11, 31), { weekStartsOn: 1 }),
    'yyyy/MM/dd'
  );
};

export const hallCleaningPlanningWeeks = (
  start: string,
  today = new Date(),
  endWeek = hallCleaningDefaultEndWeek(start, today)
) => {
  const rotationStart = parse(start, 'yyyy/MM/dd', today);
  const end = parse(endWeek, 'yyyy/MM/dd', today);
  if (!isValid(rotationStart) || !isValid(end)) return [];
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const first = rotationStart > currentWeek ? rotationStart : currentWeek;
  if (end < first) return [];
  return eachWeekOfInterval({ start: first, end }, { weekStartsOn: 1 }).map(
    (week) => format(week, 'yyyy/MM/dd')
  );
};
