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

const getDayIndex = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getUTCDay();
};

const getDayNumberInMonth = (dateString: string): number => {
  const date = new Date(dateString);
  const dayOfMonth = date.getDate();
  return dayOfMonth;
};

const getMonthIndexFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getMonth();
};

function getYearFromDate(dateString: string): number {
  const date = new Date(dateString);
  return date.getFullYear();
}

export const FormatStringForDailyHistory = (dateString: string) => {
  const { t } = useAppTranslation();

  return `${t(Days[getDayIndex(dateString)])}, ${getDayNumberInMonth(dateString)} ${t(Months[getMonthIndexFromDate(dateString)])} ${getYearFromDate(dateString)}`;
};
