import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useHourFormat = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [hour24, setHour24] = useState(false);

  const handleHour24Toggle = async () => {
    const hourFormat = structuredClone(
      settings.cong_settings.format_24h_enabled
    );
    const current = hourFormat.find((record) => record.type === dataView);

    current.value = !hour24;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.format_24h_enabled': hourFormat,
    });
  };

  useEffect(() => {
    const hourFormat = settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    );
    setHour24(hourFormat?.value ?? false);
  }, [settings, dataView]);

  return { hour24, handleHour24Toggle };
};

export default useHourFormat;
