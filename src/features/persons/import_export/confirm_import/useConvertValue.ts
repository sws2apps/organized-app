import useDateFormat from '@features/congregation/settings/meeting_forms/date_format/useDateFormat';
import { parse } from 'date-fns';

const useConvertValue = () => {
  const { shortDateFormat } = useDateFormat();

  const parseDate = (value: string): Date | null => {
    if (!value) return null;
    const hasSlash = [1, 2].includes(value.indexOf('/'));

    if (hasSlash) {
      // because dateformat cant't be detected for sure, using shortDateForamt from settings but padding in case of day or month is written with only one number
      const slashArray = value.split('/').map((el) => el.padStart(2, '0'));
      const normalizedSlash = slashArray.join('/');
      const parsedDate = parse(normalizedSlash, shortDateFormat, new Date());
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // sorting year at the beginning for iso-standard format
    const dateArray = value.replace(/[.]/g, '-').split('-');
    if (dateArray.length !== 3) return null;

    if (dateArray[0].length !== 4) {
      if (dateArray[2].length === 4) {
        dateArray.reverse();
      } else {
        return null;
      }
    }

    const normalizedDateString = dateArray
      .map((el) => el.padStart(2, '0'))
      .join('-');
    const parsedDate = new Date(normalizedDateString);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const convertValue = (value: string, targetType: string) => {
    if (value === '' || value === null) return null;

    if (targetType === 'boolean')
      return ['yes', 'true', '1'].includes(value.toLowerCase());

    if (targetType === 'number') {
      const num = Number(value);
      return Number.isNaN(num) ? null : num;
    }

    if (targetType === 'object') {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }

    if (targetType === 'gender') {
      return ['male'].includes(value.toLowerCase()) ? 'male' : 'female';
    }

    if (targetType === 'date') {
      return parseDate(value);
    }
  };
  return { convertValue };
};

export default useConvertValue;
