import { ReportMonthType, ServiceYearType } from '@definition/report';
import { formatDate } from '@services/dateformat';
import { generateMonthNames, getTranslation } from '@services/i18n/translation';
import { isValid } from 'date-fns';

export const MAX_DATE = new Date(9999, 11, 31);

export const dateFirstDayMonth = (date: Date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(year, month, 1);
};

export const dateFirstDayPreviousMonth = (date: Date = new Date()) => {
  const firstDayCurrentMonth = dateFirstDayMonth(date);
  return addMonths(firstDayCurrentMonth, -1);
};

export const getFirstWeekPreviousMonth = (date: Date = new Date()) => {
  const firstDayPreviousMonth = dateFirstDayPreviousMonth(date);
  return getWeekDate(firstDayPreviousMonth);
};

export const getFirstWeekPreviousOrNextMonths = (numberOfMonths: number) => {
  const firstDayCurrentMonth = dateFirstDayMonth(new Date());
  const date = addMonths(firstDayCurrentMonth, numberOfMonths);
  return getWeekDate(date);
};

export const dateLastDatePreviousMonth = (date: Date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(year, month, 0);
};

export const getLastWeekPreviousMonth = (date: Date = new Date()) => {
  const lastDatePreviousMonth = dateLastDatePreviousMonth(date);
  return getWeekDate(lastDatePreviousMonth);
};

export const isMondayDate = (date: string) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  return dayOfWeek === 1;
};

export const getWeekDate = (date: Date = new Date()) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(date.setDate(diff));

  return monDay;
};

export const getOldestWeekDate = () => {
  const weekDate = getWeekDate();
  const validDate = weekDate.setMonth(weekDate.getMonth() - 12);
  return new Date(validDate);
};

export const addMonths = (date: Date | string, value: number) => {
  const start_date = new Date(date);
  start_date.setMonth(start_date.getMonth() + value);

  return start_date;
};

export const addWeeks = (date: Date | string, value: number) => {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() + value * 7);

  return startDate;
};

export const addDays = (date: Date | string, value: number) => {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() + value);

  return startDate;
};

export const computeYearsDiff = (date: string) => {
  const userDate = new Date(date).getTime();
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const yearsDiff = ((now - userDate) / oneDay / 365).toFixed(1);

  return yearsDiff;
};

export const generateDateFromTime = (time: string) => {
  const timeParts = time.split(':');
  const date = new Date();
  date.setHours(+timeParts[0], +timeParts[1]);

  return date;
};

export const dateFormatFriendly = (value: string, language?: string) => {
  const monthNames = generateMonthNames(language);

  const [year, month, date] = value.split('/').map(Number);
  const monthName = monthNames[+month - 1];

  return getTranslation({
    key: 'tr_longDateWithYearLocale',
    language,
    params: { year, month: monthName, date },
  });
};

export const timeAddMinutes = (prev: string, min: number) => {
  const split = prev.split(':');
  const hour = +split[0];
  const minute = +split[1];

  let newHour = hour;
  let newMinute = minute + min;
  if (newMinute >= 60) {
    newHour = hour + 1;
    newMinute = newMinute - 60;
  }

  let result = `${newHour}:`;

  result += String(newMinute).padStart(2, '0');

  return result;
};

export const removeSecondsFromTime = (time: string) => {
  const parts = time.split(':');

  if (parts.length > 2) {
    return parts.slice(0, 2).join(':');
  }
  return time;
};

export const currentServiceYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  let value: string;

  if (month < 8) {
    value = year.toString();
  } else {
    value = String(year + 1).toString();
  }

  return value;
};

export const getMonthServiceYear = (month: string) => {
  const varYear = +month.split('/')[0];
  const varMonth = +month.split('/')[1] - 1;

  let value: string;

  if (varMonth < 8) {
    value = varYear.toString();
  } else {
    value = String(varYear + 1).toString();
  }

  return value;
};

export const currentMonthServiceYear = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthIndex = String(currentMonth + 1).padStart(2, '0');
  const monthValue = `${currentYear}/${monthIndex}`;

  return monthValue;
};

export const currentReportMonth = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  let reportMonth = currentMonth;
  let reportYear = currentYear;

  if (currentDate <= 20) {
    reportMonth = reportMonth - 1;

    if (reportMonth === -1) {
      reportMonth = 11;
      reportYear = reportYear - 1;
    }
  }

  const monthValue = String(reportMonth + 1).padStart(2, '0');

  return `${reportYear}/${monthValue}`;
};

export const buildServiceYearsList = () => {
  const monthNames = generateMonthNames();
  const currentSY = currentServiceYear();

  const years: string[] = [];

  let year = +currentSY;
  years.push(year.toString());

  do {
    year = year - 1;

    years.push(year.toString());
  } while (years.length < 4);

  years.sort();

  const result: ServiceYearType[] = [];

  for (const year of years) {
    const monthsList: { value: string; label: string }[] = [];

    const isCurrent = year === currentSY;
    let maxIndex: number;

    if (!isCurrent) {
      maxIndex = 13;
    } else {
      const currentMonth = new Date().getMonth();
      maxIndex = currentMonth < 9 ? currentMonth + 7 : currentMonth - 5;

      if (maxIndex > 13) maxIndex = 13;
    }

    for (let i = 1; i < maxIndex; i++) {
      const monthIndex = i < 5 ? i + 8 : i - 4;
      const newYear = i < 5 ? +year - 1 : year;

      let month = `${newYear}/`;
      month += String(monthIndex).padStart(2, '0');

      const monthName = monthNames[monthIndex - 1];

      monthsList.push({
        value: month,
        label: getTranslation({
          key: 'tr_monthYear',
          params: { year: newYear, month: monthName },
        }),
      });
    }

    result.push({
      year,
      months: monthsList,
    });
  }

  return result;
};

export const buildPublisherReportMonths = () => {
  const results: ReportMonthType[] = [];

  const monthNames = generateMonthNames();

  const initialMonth = currentMonthServiceYear();
  const [initYear, initMonth] = initialMonth.split('/');

  let year = +initYear;
  let month = +initMonth - 1;

  // add 1 month ahead
  month = month + 1;
  if (month === 12) {
    year++;
    month = 0;
  }

  for (let i = 0; i < 13; i++) {
    results.push({
      label: monthNames[month],
      value: `${year}/${String(month + 1).padStart(2, '0')}`,
    });

    month--;

    if (month === -1) {
      month = 11;
      year = year - 1;
    }
  }

  return results.sort((a, b) => a.value.localeCompare(b.value));
};

export const computeMonthsDiff = (startDate: Date, endDate: Date) => {
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();

  return monthsDiff + 12 * yearsDiff;
};

export const createArrayFromMonths = (startMonth: string, endMonth: string) => {
  const result: string[] = [];

  let currentMonth = startMonth;

  do {
    result.push(currentMonth);

    const date = new Date(`${currentMonth}/01`);
    const nextMonth = addMonths(date, 1);
    currentMonth = formatDate(nextMonth, 'yyyy/MM');
  } while (currentMonth !== endMonth);

  result.push(endMonth);

  return result;
};

export const weeksInMonth = (month: string) => {
  const [year, monthValue] = month.split('/').map(Number);

  const firstDay = new Date(year, monthValue - 1, 1);

  const firstMonday =
    firstDay.getDay() === 1
      ? firstDay
      : new Date(
          year,
          monthValue - 1,
          firstDay.getDate() + ((8 - firstDay.getDay()) % 7)
        );

  const weeks: string[] = [];
  const currentMonday = new Date(firstMonday);

  while (currentMonday.getMonth() === firstMonday.getMonth()) {
    weeks.push(formatDate(new Date(currentMonday), 'yyyy/MM/dd'));
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  return weeks;
};

export const groupConsecutiveMonths = (months: string[]) => {
  const result: string[] = [];
  let start = months[0];
  let end = months[0];

  for (let i = 1; i < months.length; i++) {
    const current = months[i];
    const prev = months[i - 1];
    const [currentYear, currentMonth] = current.split('/').map(Number);
    const [prevYear, prevMonth] = prev.split('/').map(Number);

    if (
      (currentYear === prevYear && currentMonth === prevMonth + 1) ||
      (currentYear === prevYear + 1 && currentMonth === 1 && prevMonth === 12)
    ) {
      end = current;
    } else {
      result.push(start === end ? start : `${start}-${end}`);
      start = current;
      end = current;
    }
  }

  result.push(start === end ? start : `${start}-${end}`);
  return result;
};

export const isValidDate = (value: unknown) => {
  return isValid(value);
};
