import dateFormat from 'dateformat';

export const formatDate = (date: Date, format: string) => {
  return dateFormat(date, format);
};
