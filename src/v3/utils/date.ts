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
  const startDate = new Date(date);
  const result = startDate.setMonth(startDate.getMonth() + value);

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

  for (let month = 8; month < 11; month++) {
    const monthName = getMonthName(month);
    monthsList[month] = `${monthName} ${year}`;
  }

  for (let month = 0; month < 8; month++) {
    const monthName = getMonthName(month);
    monthsList[month] = `${monthName} ${year + 1}`;
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
