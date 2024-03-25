import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { enableHourCreditsState } from '@states/settings';
import { handleUpdateSetting } from '@services/dexie/settings';

const useMinistryPreferences = () => {
  const enableHourCredits = useRecoilValue(enableHourCreditsState);

  const [addCredits, setAddCredits] = useState(false);

  const handleAddCreditsChange = async (value) => {
    setAddCredits(value);

    await handleUpdateSetting({ enable_hour_credits: { value, updatedAt: new Date().toISOString() } });
  };

  useEffect(() => {
    setAddCredits(enableHourCredits);
  }, [enableHourCredits]);

  return { addCredits, handleAddCreditsChange };
};

export default useMinistryPreferences;
