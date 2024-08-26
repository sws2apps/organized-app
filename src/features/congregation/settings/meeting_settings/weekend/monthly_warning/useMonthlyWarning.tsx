import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMonthlyWarning = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [monthlyOverlapShown, setMonthlyOverlapShown] = useState(true);

  const handleMonthlyOverlapToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.consecutive_monthly_parts_notice_shown.value = !monthlyOverlapShown;
    current.consecutive_monthly_parts_notice_shown.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setMonthlyOverlapShown(
      weekendSettings.consecutive_monthly_parts_notice_shown.value
    );
  }, [settings, dataView]);

  return {
    handleMonthlyOverlapToggle,
    monthlyOverlapShown,
  };
};

export default useMonthlyWarning;
