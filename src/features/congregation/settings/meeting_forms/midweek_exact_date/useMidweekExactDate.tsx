import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMidweekExactDate = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [displayExactDate, setDisplayExactDate] = useState(false);

  const handleDisplayExactDateToggle = async () => {
    const exactDate = structuredClone(
      settings.cong_settings.schedule_exact_date_enabled
    );

    exactDate.value = !displayExactDate;
    exactDate.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.schedule_exact_date_enabled': exactDate,
    });
  };

  useEffect(() => {
    setDisplayExactDate(
      settings.cong_settings.schedule_exact_date_enabled.value
    );
  }, [settings, dataView]);

  return {
    displayExactDate,
    handleDisplayExactDateToggle,
  };
};

export default useMidweekExactDate;
