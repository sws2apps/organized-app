import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congAccountConnectedState } from '@states/app';

const useCongregationPrivacy = () => {
  const settings = useRecoilValue(settingsState);
  const isConnected = useRecoilValue(congAccountConnectedState);

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

  return {
    timeAwayPublic,
    handleTimeAwayPublicToggle,
    isConnected,
  };
};

export default useCongregationPrivacy;
