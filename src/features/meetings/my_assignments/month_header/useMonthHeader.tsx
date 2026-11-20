import { useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';

const useMonthHeader = (month: string) => {
  const monthNames = useAtomValue(monthNamesState);

  return { monthName: monthNames[+month.split('/')[1] - 1] };
};

export default useMonthHeader;
