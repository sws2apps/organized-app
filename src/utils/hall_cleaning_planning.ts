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
  const end = new Date(first.getFullYear(), 11, 31);
  return eachWeekOfInterval({ start: first, end }, { weekStartsOn: 1 }).map(
    (week) => format(week, 'yyyy/MM/dd')
  );
};
