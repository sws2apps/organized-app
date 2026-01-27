import {
  UpcomingEventCategory,
  UpcomingEventDataType,
  UpcomingEventType,
} from '@definition/upcoming_events';
import { formatDate, getDatesBetweenDates } from '@utils/date';
import {
  generateMonthShortNames,
  generateWeekday,
  getTranslation,
} from '@services/i18n/translation';
import { store } from '@states/index';
import { hour24FormatState } from '@states/settings';

export const upcomingEventData = (event: UpcomingEventType) => {
  const hour24 = store.get(hour24FormatState);

  const months = generateMonthShortNames();
  const weekdays = generateWeekday();

  const result = {} as UpcomingEventDataType;

  result.uid = event.event_uid;
  result.category = event.event_data.category;
  result.custom = event.event_data.custom;
  result.description = event.event_data.description;
  result.duration = event.event_data.duration;

  result.year = new Date(event.event_data.start).getFullYear();

  const start = new Date(event.event_data.start);
  const date = start.getDate();
  const monthIndex = start.getMonth();

  const month = months[monthIndex];

  result.start = formatDate(start, 'yyyy/MM/dd');
  result.date = getTranslation({
    key: 'tr_longDateNoYearLocale',
    params: { month, date },
  });

  const todayIndex = start.getDay();
  result.day = weekdays[todayIndex === 0 ? 6 : todayIndex - 1];

  const eventDates = getDatesBetweenDates(
    event.event_data.start,
    event.event_data.end
  );

  result.dates = eventDates.map((date) => {
    const dayIndex = date.getDay();
    const dateV = date.getDate();
    const monthIndex = date.getMonth();
    const month = months[monthIndex];

    return {
      date: formatDate(date, 'yyyy/MM/dd'),
      day: weekdays[dayIndex === 0 ? 6 : dayIndex - 1],
      dateFormatted: getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: { month, date: dateV },
      }),
    };
  });

  if (event.event_data.category === UpcomingEventCategory.SpecialCampaignWeek) {
    const startDate = eventDates.at(0);
    const startDateV = startDate.getDate();
    const startMonthIndex = startDate.getMonth();
    const startMonth = months[startMonthIndex];

    const endDate = eventDates.at(-1);
    const endDateV = endDate.getDate();
    const endMonthIndex = endDate.getMonth();
    const endMonth = months[endMonthIndex];

    if (startMonthIndex !== endMonthIndex) {
      const startDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: startMonth,
          date: startDateV,
        },
      });

      const endDateFormatted = getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: endMonth,
          date: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
      });
    }

    if (startMonthIndex === endMonthIndex) {
      const dateRanges = getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: startDateV,
          endDate: endDateV,
        },
      });

      result.datesRange = getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: startMonth,
          date: dateRanges,
        },
      });
    }
  }

  const startTime = formatDate(
    new Date(event.event_data.start),
    hour24 ? 'HH:mm' : 'hh:mmaaa'
  );

  const endTime = formatDate(
    new Date(event.event_data.end),
    hour24 ? 'HH:mm' : 'hh:mmaaa'
  );

  result.time = getTranslation({
    key: 'tr_dateRangeNoYear',
    params: {
      startDate: startTime,
      endDate: endTime,
    },
  });

  return result;
};
