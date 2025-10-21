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
    const dayPosition = [0, 1, 2].filter(
      (pos) => pos !== yearPosition && pos !== monthPosition
    )[0];
    const year = parseInt(dateArray[yearPosition]);
    const month = parseInt(dateArray[monthPosition]);
    const day = parseInt(dateArray[dayPosition]);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const convertValue = (value: string, targetType: string) => {
    const trimmed = (value ?? '').trim();
    if (trimmed === '' || value === null) return null;
    const lower = trimmed.toLowerCase();

    if (targetType === 'boolean') return ['yes', 'true', '1'].includes(lower);

    if (targetType === 'number') {
      const num = Number(trimmed);
      return Number.isNaN(num) ? null : num;
    }

    if (targetType === 'object') {
      try {
        return JSON.parse(trimmed);
      } catch {
        return null;
      }
    }

    if (targetType === 'gender') {
      if (['male', 'm'].includes(lower)) return 'male';
      if (['female', 'f', 'w'].includes(lower)) return 'female';
      return null;
    }

    if (targetType === 'date') {
      return parseDate(trimmed);
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
