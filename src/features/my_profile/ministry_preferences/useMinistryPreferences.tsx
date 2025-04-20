import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { hoursCreditsEnabledState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMinistryPreferences = () => {
  const enableHourCredits = useAtomValue(hoursCreditsEnabledState);

  const [addCredits, setAddCredits] = useState(false);

  const handleAddCreditsChange = async (value) => {
    setAddCredits(value);

    await dbAppSettingsUpdate({
      'user_settings.hour_credits_enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  useEffect(() => {
    setAddCredits(enableHourCredits);
  }, [enableHourCredits]);

  return { addCredits, handleAddCreditsChange };
};

export default useMinistryPreferences;
