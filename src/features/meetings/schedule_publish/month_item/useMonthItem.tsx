import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';

const useMonthItem = (month: string) => {
  const [publishedTooltipOpen, setPublishedTooltipOpen] = useState(false);
  const monthNames = useAtomValue(monthNamesState);

  const monthName = useMemo(() => {
    const monthIndex = +month.split('/')[1];

    return monthNames[monthIndex - 1];
  }, [month, monthNames]);

  return { monthName, publishedTooltipOpen, setPublishedTooltipOpen };
};

export default useMonthItem;
