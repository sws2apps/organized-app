import { useAtomValue } from 'jotai';
import { dayNamesShortState } from '@states/app';

const useDateLabel = (date: string) => {
  const dayNames = useAtomValue(dayNamesShortState);

  const value = new Date(date);

  return { day: value.getDate(), weekday: dayNames[value.getDay()] };
};

export default useDateLabel;
