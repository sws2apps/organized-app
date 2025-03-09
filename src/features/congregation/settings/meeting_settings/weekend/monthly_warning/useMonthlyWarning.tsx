import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  settingsState,
  userDataViewState,
  weekendMeetingShowMonthlyWarningState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMonthlyWarning = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const initialValue = useRecoilValue(weekendMeetingShowMonthlyWarningState);

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
    setMonthlyOverlapShown(initialValue);
  }, [initialValue]);

  return {
    handleMonthlyOverlapToggle,
    monthlyOverlapShown,
  };
};

export default useMonthlyWarning;
