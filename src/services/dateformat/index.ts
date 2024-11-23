import { format as dateFormat } from 'date-fns';

export const formatDate = (date: Date, format: string) => {
  return dateFormat(date, format);
};

export const formatLongDate = (date: Date, format: string, use24: boolean) => {
  const hoursFormat = use24 ? 'HH:mm' : 'h:mm aaa';
  const longFormat = `${format} ${hoursFormat}`;

  return formatDate(date, longFormat);
};
