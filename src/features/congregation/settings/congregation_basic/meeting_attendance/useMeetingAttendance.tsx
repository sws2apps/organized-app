import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMeetingAttendance = () => {
  const settings = useRecoilValue(settingsState);

  const [recordOnline, setRecordOnline] = useState(false);

  const handleRecordOnlineToggle = async () => {
    const newRecordOnline = structuredClone(
      settings.cong_settings.attendance_online_record
    );

    newRecordOnline.value = !recordOnline;
    newRecordOnline.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.attendance_online_record': newRecordOnline,
    });
  };

  useEffect(() => {
    setRecordOnline(settings.cong_settings.attendance_online_record.value);
  }, [settings]);

  return {
    recordOnline,
    handleRecordOnlineToggle,
  };
};

export default useMeetingAttendance;
