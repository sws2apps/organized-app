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
    const sourceMaterial = structuredClone(
      settings.cong_settings.source_material
    );

    sourceMaterial.auto_import.enabled.value = !sourceAutoUpdate;
    sourceMaterial.auto_import.enabled.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material': sourceMaterial,
    });
  };

  const handleSourceUpdateFrequencyChange = async (value: SourceFrequency) => {
    const sourceMaterial = structuredClone(
      settings.cong_settings.source_material
    );

    sourceMaterial.auto_import.frequency.value = value;
    sourceMaterial.auto_import.frequency.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material': sourceMaterial,
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
