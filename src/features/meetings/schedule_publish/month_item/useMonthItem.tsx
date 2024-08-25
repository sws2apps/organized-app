import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';

const useMonthItem = (month: string) => {
  const monthNames = useRecoilValue(monthNamesState);

  const monthName = useMemo(() => {
    const monthIndex = +month.split('/')[1];

    return monthNames[monthIndex - 1];
  }, [month, monthNames]);

  return { monthName };
};

export default useMonthItem;
