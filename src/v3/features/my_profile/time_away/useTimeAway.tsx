import { useEffect, useState } from 'react';
import { useBreakpoints } from '@hooks/index';
import { useRecoilValue } from 'recoil';
import { userTimeAwayState } from '@states/settings';
import { handleUserTimeAwayAdd, handleUserTimeAwayDelete } from '@services/dexie/settings';

const useTimeAway = () => {
  const { tabletDown } = useBreakpoints();

  const userTimeAway = useRecoilValue(userTimeAwayState);

  const [timeAwayList, setTimeAwayList] = useState(userTimeAway);

  useEffect(() => {
    setTimeAwayList(userTimeAway);
  }, [userTimeAway]);

  return { timeAwayList, handleUserTimeAwayAdd, tabletDown, handleUserTimeAwayDelete };
};

export default useTimeAway;
