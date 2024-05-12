import useAppTranslation from '@hooks/useAppTranslation';

export const Days = ['tr_sunday', 'tr_monday', 'tr_tuesday', 'tr_wednesday', 'tr_thursday', 'tr_friday', 'tr_saturday'];
export const Months = [
  'tr_january',
  'tr_february',
  'tr_march',
  'tr_april',
  'tr_may',
  'tr_june',
  'tr_july',
  'tr_august',
  'tr_september',
  'tr_october',
  'tr_november',
  'tr_december',
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
 * @param dateString The string representation of the date.
 * @returns The formatted date string.
 */
export const FormatStringForDailyHistory = (dateString: string) => {
  const { t } = useAppTranslation();

  return `${t(Days[getDayIndex(dateString)])}, ${getDayNumberInMonth(dateString)} ${t(Months[getMonthIndexFromDate(dateString)])} ${getYearFromDate(dateString)}`;
};
