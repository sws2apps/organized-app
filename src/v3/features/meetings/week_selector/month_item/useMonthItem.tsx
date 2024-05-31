import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';

const useMonthItem = (month: number) => {
  const monthNames = useRecoilValue(monthNamesState);

  const [expanded, setExpanded] = useState(false);

  const monthName = monthNames[month];

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return { monthName, expanded, handleToggleExpand };
};

export default useMonthItem;
