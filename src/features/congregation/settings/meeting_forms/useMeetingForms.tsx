import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { SourceFrequency } from '@definition/settings';

const useMeetingForms = () => {
  const settings = useRecoilValue(settingsState);

  const [sourceAutoUpdate, setSourceAutoUpdate] = useState(false);
  const [sourceUpdateFrequency, setSourceUpdateFrequency] = useState(
    SourceFrequency.WEEKLY
  );

  const handleSourceAutoUpdateToggle = async () => {
    const sourceAutoUpdateEnable = structuredClone(
      settings.cong_settings.source_material.auto_import.enabled
    );

    sourceAutoUpdateEnable.value = !sourceAutoUpdate;
    sourceAutoUpdateEnable.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material.auto_import.enabled':
        sourceAutoUpdateEnable,
    });
  };

  const handleSourceUpdateFrequencyChange = async (value: SourceFrequency) => {
    const updateFrequency = structuredClone(
      settings.cong_settings.source_material.auto_import.frequency
    );

    updateFrequency.value = value;
    updateFrequency.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material.auto_import.frequency': updateFrequency,
    });
  };

  useEffect(() => {
    setSourceAutoUpdate(
      settings.cong_settings.source_material.auto_import.enabled.value
    );

    setSourceUpdateFrequency(
      settings.cong_settings.source_material.auto_import.frequency.value
    );
  }, [settings]);

  return {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    sourceUpdateFrequency,
    handleSourceUpdateFrequencyChange,
  };
};

export default useMeetingForms;
