import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  settingsState,
  sourcesJWAutoImportFrequencyState,
  sourcesJWAutoImportState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { SettingsType, SourceFrequency } from '@definition/settings';
import { UpdateSpec } from 'dexie';

const useMeetingForms = () => {
  const settings = useAtomValue(settingsState);
  const autoImportInitial = useAtomValue(sourcesJWAutoImportState);
  const frequencyInitial = useAtomValue(sourcesJWAutoImportFrequencyState);

  const [sourceAutoUpdate, setSourceAutoUpdate] = useState(false);
  const [sourceUpdateFrequency, setSourceUpdateFrequency] = useState(
    SourceFrequency.WEEKLY
  );

  const handleSourceAutoUpdateToggle = async () => {
    const enabled = structuredClone(
      settings.cong_settings.source_material.auto_import.enabled
    );

    enabled.value = !sourceAutoUpdate;
    enabled.updatedAt = new Date().toISOString();

    // Dexie supports dot-path keys at runtime but UpdateSpec can't type them
    // for deeply nested non-array fields. A targeted Record cast is safer than
    // overwriting the entire source_material object (which risks clobbering
    // concurrent changes to sibling fields like `language`).
    await dbAppSettingsUpdate({
      'cong_settings.source_material.auto_import.enabled': enabled,
    } as UpdateSpec<SettingsType>);
  };

  const handleSourceUpdateFrequencyChange = async (value: SourceFrequency) => {
    const frequency = structuredClone(
      settings.cong_settings.source_material.auto_import.frequency
    );

    frequency.value = value;
    frequency.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material.auto_import.frequency': frequency,
    } as UpdateSpec<SettingsType>);
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
