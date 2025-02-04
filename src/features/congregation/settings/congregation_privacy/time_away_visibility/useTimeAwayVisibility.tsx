import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useTimeAwayVisibility = () => {
  const settings = useRecoilValue(settingsState);

  const [timeAwayPublic, setTimeAwayPublic] = useState(false);

  const handleTimeAwayPublicToggle = async () => {
    const timeAway = structuredClone(settings.cong_settings.time_away_public);

    timeAway.value = !timeAwayPublic;
    timeAway.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.time_away_public': timeAway,
    });
  };

  useEffect(() => {
    setTimeAwayPublic(settings.cong_settings.time_away_public.value);
  }, [settings]);

  return { timeAwayPublic, handleTimeAwayPublicToggle };
};

export default useTimeAwayVisibility;
