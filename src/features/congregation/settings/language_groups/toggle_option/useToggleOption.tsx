import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useToggleOption = () => {
  const settings = useAtomValue(settingsState);

  const initialValue = useMemo(() => {
    if (Array.isArray(settings.cong_settings.language_groups)) {
      return false;
    }

    return settings.cong_settings.language_groups.enabled.value;
  }, [settings]);

  const [value, setValue] = useState(initialValue);

  const handleToggle = async (value: boolean) => {
    if (Array.isArray(settings.cong_settings.language_groups)) {
      await dbAppSettingsUpdate({
        'cong_settings.language_groups': {
          enabled: { value, updatedAt: new Date().toISOString() },
          groups: [],
        },
      });

      return;
    }

    let dataView = settings.user_settings.data_view;

    if (!value && dataView !== 'main') {
      dataView = 'main';
    }

    await dbAppSettingsUpdate({
      'cong_settings.language_groups.enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
      'user_settings.data_view': dataView,
    });
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, handleToggle };
};

export default useToggleOption;
