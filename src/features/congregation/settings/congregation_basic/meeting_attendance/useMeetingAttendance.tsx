import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  attendanceOnlineRecordState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMeetingAttendance = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnlineInitial = useAtomValue(attendanceOnlineRecordState);

  const [recordOnline, setRecordOnline] = useState(false);

  const handleRecordOnlineToggle = async () => {
    let newRecordOnline = structuredClone(
      settings.cong_settings.attendance_online_record
    );

    if (!Array.isArray(newRecordOnline)) {
      const updatedAt = newRecordOnline['updatedAt'];
      const value = newRecordOnline['value'];

      newRecordOnline = [{ type: 'main', _deleted: false, updatedAt, value }];
    }

    const findRecord = newRecordOnline.find(
      (record) => record.type === dataView
    );

    if (findRecord) {
      findRecord.value = !recordOnline;
      findRecord.updatedAt = new Date().toISOString();
    }

    if (!findRecord) {
      newRecordOnline.push({
        type: dataView,
        _deleted: false,
        updatedAt: new Date().toISOString(),
        value: !recordOnline,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.attendance_online_record': newRecordOnline,
    });
  };

  useEffect(() => {
    setRecordOnline(recordOnlineInitial);
  }, [recordOnlineInitial]);

  return {
    recordOnline,
    handleRecordOnlineToggle,
  };
};

export default useMeetingAttendance;
