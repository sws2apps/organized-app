import { useState } from 'react';
import { useBreakpoints } from '@hooks/index';

const dummyTimeAwayList = [];

const useTimeAway = () => {
  const { tabletDown } = useBreakpoints();

  const [timeAwayList, setTimeAwayList] = useState(dummyTimeAwayList);

  const handleAddTimeAway = async () => {
    const newArray = [
      ...timeAwayList,
      { id: crypto.randomUUID(), startDate: new Date().toISOString(), endDate: '', comments: '' },
    ];
    setTimeAwayList(newArray);
  };

  const handleDeleteTimeAway = async (id: string) => {
    const newArray = timeAwayList.filter((item) => item.id !== id);
    setTimeAwayList(newArray);
  };

  return { timeAwayList, handleAddTimeAway, tabletDown, handleDeleteTimeAway };
};

export default useTimeAway;
