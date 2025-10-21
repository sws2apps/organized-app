import { useMemo } from 'react';
import useDateFormat from '@features/congregation/settings/meeting_forms/date_format/useDateFormat';

const createConverter = (dateFormat: string) => {
  const parseDate = (value: string): Date | null => {
    if (!value) return null;

    const dateArray = value.replace(/[./]/g, '-').split('-');
    if (dateArray.length !== 3) return null;

    const yearPosition =
      dateArray[0].length === 4 ? 0 : dateArray[2].length === 4 ? 2 : null;
    if (yearPosition === null) return null;
    const monthPosition = dateFormat.slice(0, 2) === 'MM' ? 0 : 1;
    const dayPosition = monthPosition === 0 ? 1 : 0;
    const year = parseInt(dateArray[yearPosition]);
    const month = parseInt(dateArray[monthPosition]);
    const day = parseInt(dateArray[dayPosition]);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const convertValue = (value: string, targetType: string) => {
    const s = value.toLowerCase().trim();
    if (value === '' || value === null) return null;

    if (targetType === 'boolean') return ['yes', 'true', '1'].includes(s);

    if (targetType === 'number') {
      const num = Number(s);
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
      if (['male', 'm'].includes(s)) return 'male';
      if (['female', 'f', 'w'].includes(s)) return 'female';
      return null;
    }

    if (targetType === 'date') {
      return parseDate(s);
    }

    return value;
  };

  return convertValue;
};

const useConvertValue = () => {
  const { shortDateFormat } = useDateFormat();

  const convertValue = useMemo(
    () => createConverter(shortDateFormat),
    [shortDateFormat]
  );

  return { convertValue };
};

export default useConvertValue;
