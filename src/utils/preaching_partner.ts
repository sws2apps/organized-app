import { addDays, format, isValid, parse } from 'date-fns';
import { DateTime, EventAttributes } from 'ics';
import {
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';

export const partnerDate = (date: string) =>
  parse(date, 'yyyy/MM/dd', new Date());
export const partnerToday = () => format(new Date(), 'yyyy/MM/dd');
export const partnerDateIsValid = (date: string) => {
  const parsed = partnerDate(date);
  return isValid(parsed) && format(parsed, 'yyyy/MM/dd') === date;
};
const validTime = (time?: string) =>
  !!time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

export const partnerRequestIsValid = (
  { request_data: data }: PreachingPartnerRequestType,
  today = partnerToday()
) =>
  partnerDateIsValid(data.date) &&
  data.date >= today &&
  Object.values(PreachingPartnerMinistryType).includes(data.type) &&
  typeof data.type === 'number' &&
  (data.flexible ||
    (validTime(data.start) &&
      (!data.end || (validTime(data.end) && data.end > (data.start ?? '')))));

export const partnerCalendarEvent = (
  request: PreachingPartnerRequestType,
  title: string
): EventAttributes => {
  const { date, flexible, start, end, comment } = request.request_data;
  if (!partnerRequestIsValid(request, date))
    throw new Error('tr_partnerInvalidRequest');
  const day = partnerDate(date);
  const next = addDays(day, 1);
  const startDate: [number, number, number] = [
    day.getFullYear(),
    day.getMonth() + 1,
    day.getDate(),
  ];
  const details = { uid: request.request_uid, title, description: comment };
  if (flexible)
    return {
      ...details,
      start: startDate,
      end: [next.getFullYear(), next.getMonth() + 1, next.getDate()],
    };
  if (!start) throw new Error('tr_partnerInvalidRequest');
  const timedStart = [
    ...startDate,
    ...start.split(':').map(Number),
  ] as DateTime;
  if (end)
    return {
      ...details,
      startInputType: 'local',
      endInputType: 'local',
      start: timedStart,
      end: [...startDate, ...end.split(':').map(Number)] as DateTime,
    };
  return {
    ...details,
    startInputType: 'local',
    start: timedStart,
    duration: { hours: 1 },
  };
};
