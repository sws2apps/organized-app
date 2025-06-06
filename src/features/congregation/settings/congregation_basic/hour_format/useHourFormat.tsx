import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  hour24FormatState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useHourFormat = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const hour24Default = useAtomValue(hour24FormatState);

  const [hour24, setHour24] = useState(hour24Default);

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
    setHour24(hour24Default);
  }, [hour24Default]);

  return { hour24, handleHour24Toggle };
};

export default useHourFormat;
