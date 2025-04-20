import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  settingsState,
  sourcesJWAutoImportFrequencyState,
  sourcesJWAutoImportState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { SourceFrequency } from '@definition/settings';

const useMeetingForms = () => {
  const settings = useAtomValue(settingsState);
  const autoImportInitial = useAtomValue(sourcesJWAutoImportState);
  const frequencyInitial = useAtomValue(sourcesJWAutoImportFrequencyState);

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
    setSourceAutoUpdate(autoImportInitial);
    setSourceUpdateFrequency(frequencyInitial);
  }, [autoImportInitial, frequencyInitial]);

  return {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    sourceUpdateFrequency,
    handleSourceUpdateFrequencyChange,
  };
};

export default useMeetingForms;
