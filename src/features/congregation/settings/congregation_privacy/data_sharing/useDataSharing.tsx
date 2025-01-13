import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbResetExportState } from '@services/dexie/metadata';

const useDataSharing = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [value, setValue] = useState(false);

  const handleToggleValue = async () => {
    const current = structuredClone(settings.cong_settings.data_sync);

    current.value = !value;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.data_sync': current,
    });

    if (current.value) {
      await dbResetExportState();
    }
  };

  useEffect(() => {
    const defaultValue = settings.cong_settings.data_sync.value;

    setValue(defaultValue);
  }, [settings, dataView]);

  return { value, handleToggleValue };
};

export default useDataSharing;
