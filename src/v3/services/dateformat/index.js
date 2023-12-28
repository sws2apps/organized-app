import dateFormat from 'dateformat';

export const formatDate = (date, format) => {
  return dateFormat(date, format);
};
