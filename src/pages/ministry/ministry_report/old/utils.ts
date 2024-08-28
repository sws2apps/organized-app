import { MONTHS } from '@constants/index';
import useAppTranslation from '@hooks/useAppTranslation';

export const Days = [
  'tr_sunday',
  'tr_monday',
  'tr_tuesday',
  'tr_wednesday',
  'tr_thursday',
  'tr_friday',
  'tr_saturday',
];

/**
 * Get the index of the day in a week (0 for Sunday, 1 for Monday, etc.).
 * @param dateString The string representation of the date.
 * @returns The index of the day in a week.
 */
export const getDayIndex = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getUTCDay();
};

/**
 * Get the day number in the month.
 * @param dateString The string representation of the date.
 * @returns The day number in the month.
 */
export const getDayNumberInMonth = (dateString: string): number => {
  const date = new Date(dateString);
  const dayOfMonth = date.getDate();
  return dayOfMonth;
};

/**
 * Get the index of the month in a year (0 for January, 1 for February, etc.).
 * @param dateString The string representation of the date.
 * @returns The index of the month in a year.
 */
export const getMonthIndexFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getMonth();
};

/**
 * Get the year from the date.
 * @param dateString The string representation of the date.
 * @returns The year.
 */
export function getYearFromDate(dateString: string): number {
  const date = new Date(dateString);
  return date.getFullYear();
}

/**
 * Format the date string for daily history display.
 *
 * This function takes a date string and formats it into a more readable format
 * for daily history displays. It translates the day and month names using the
 * application's translation system and optionally inserts a newline character
 * between the day name and the day number.
 *
 * @param dateString - The string representation of the date to be formatted.
 * @param newline - A boolean indicating whether a newline character should be
 *                  inserted between the day name and the day number.
 * @returns A formatted date string, e.g., "Monday,\n 5 January 2024" if newline
 *          is true, or "Monday, 5 January 2024" if newline is false.
 */
export const FormatStringForDailyHistory = (
  dateString: string,
  newline: boolean
) => {
  const { t } = useAppTranslation();

  return `${t(Days[getDayIndex(dateString)])},${newline ? '\n' : ''} ${getDayNumberInMonth(dateString)} ${t(MONTHS[getMonthIndexFromDate(dateString)])} ${getYearFromDate(dateString)}`;
};
