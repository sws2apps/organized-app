import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { useMemo } from 'react';

const useMigration = () => {
  const settings = useRecoilValue(settingsState);

  const open = useMemo(() => {
    return settings.cong_settings.cong_migrated ?? false;
  }, [settings]);

  const handleClose = async () => {
    await dbAppSettingsUpdate({ 'cong_settings.cong_migrated': false });
  };

  return { open, handleClose };
};

export default useMigration;
