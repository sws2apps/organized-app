import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userTimeAwayState } from '@states/settings';
import { dbAppSettingsTimeAwayAdd, dbAppSettingsTimeAwayDelete } from '@services/dexie/settings';

const useTimeAway = () => {
  const userTimeAway = useRecoilValue(userTimeAwayState);

  const [timeAwayList, setTimeAwayList] = useState(userTimeAway);

  useEffect(() => {
    setTimeAwayList(userTimeAway);
  }, [userTimeAway]);

  return { timeAwayList, dbAppSettingsTimeAwayAdd, dbAppSettingsTimeAwayDelete };
};

export default useTimeAway;
