import { generateMonthNames, getTranslation } from '@services/i18n/translation';

export const dateFirstDayMonth = (date: Date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(year, month, 1);
};

export const dateLastDatePreviousMonth = (date: Date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(year, month, 0);
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
  const result = start_date.setMonth(start_date.getMonth() + value);

  return new Date(result);
};

export const addWeeks = (date: Date | string, value: number) => {
  const startDate = new Date(date);
  const result = startDate.setDate(startDate.getDate() + value * 7);

  return new Date(result);
};

export const computeYearsDiff = (date: string) => {
  const userDate = new Date(date).getTime();
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const yearsDiff = ((now - userDate) / oneDay / 365).toFixed(1);

  return yearsDiff;
};

export const getTeochraticalYear = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month < 9) {
    return year - 1;
  }

  return year;
};

export const getTheocraticalYearsList = (lengthOfList = 5) => {
  const currentYear = new Date().getFullYear();
  const yearsList = [];

  for (let i = 0; i < lengthOfList; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    const yearRange = `${startYear}-${endYear}`;
    yearsList[startYear] = yearRange;
  }

  return yearsList;
};

export const getTheocraticalMonthListInAYear = (year: number) => {
  const monthsList = [];

  for (let month = 8; month < 12; month++) {
    const monthName = getMonthName(month);
    monthsList.push(`${monthName} ${year}`);
  }

  for (let month = 0; month < 8; month++) {
    const monthName = getMonthName(month);
    monthsList.push(`${monthName} ${year + 1}`);
  }

  return monthsList;
};

const getMonthName = (month: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[month];
};

export const getTheocraticalMonthDate = (monthIndex: number, year: number) => {
  let month = 0;

  if (monthIndex < 4) {
    month = monthIndex + 9;
  } else {
    year = year + 1;
    month = monthIndex - 3;
  }

  return `${year}-${month.toString().padStart(2, '0')}`;
};

export function getWeekNumberInMonthForDate(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const firstSunday = 1 + (7 - dayOfWeek);
  const diff = date.getDate() - firstSunday;
  return Math.ceil(diff / 7) + 1;
}
export const generateDateFromTime = (time: string) => {
  const timeParts = time.split(':');
  const date = new Date();
  date.setHours(+timeParts[0], +timeParts[1]);

  return date;
};

export const dateFormatFriendly = (value: string) => {
  const monthNames = generateMonthNames();

  const [year, month, date] = value.split('/');
  const monthName = monthNames[+month - 1];

  return getTranslation({
    key: 'tr_longDateWithYearLocale',
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
