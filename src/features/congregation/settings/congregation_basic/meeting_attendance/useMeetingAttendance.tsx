import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  attendanceDeafRecordState,
  attendanceOnlineRecordState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingSchema } from '@services/dexie/schema';

type DataViewSetting = {
  type: string;
  value: boolean;
  updatedAt: string;
  _deleted: boolean;
};

const setValueForDataView = (
  records: DataViewSetting[],
  dataView: string,
  value: boolean
) => {
  const updatedAt = new Date().toISOString();

  const current = records.find((record) => record.type === dataView);

  if (current) {
    current.value = value;
    current.updatedAt = updatedAt;
  } else {
    records.push({ type: dataView, _deleted: false, updatedAt, value });
  }

  return records;
};

const useMeetingAttendance = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const recordOnlineInitial = useAtomValue(attendanceOnlineRecordState);
  const recordDeafInitial = useAtomValue(attendanceDeafRecordState);

  const [recordOnline, setRecordOnline] = useState(false);
  const [recordDeaf, setRecordDeaf] = useState(false);

  const handleRecordOnlineToggle = async () => {
    let newRecordOnline = structuredClone(
      settings.cong_settings.attendance_online_record
    );

    if (!Array.isArray(newRecordOnline)) {
      const updatedAt = newRecordOnline['updatedAt'];
      const value = newRecordOnline['value'];

      newRecordOnline = [{ type: 'main', _deleted: false, updatedAt, value }];
    }

    await dbAppSettingsUpdate({
      'cong_settings.attendance_online_record': setValueForDataView(
        newRecordOnline,
        dataView,
        !recordOnline
      ),
    });
  };

  const handleRecordDeafToggle = async () => {
    const newRecordDeaf = structuredClone(
      settings.cong_settings.attendance_deaf_record ??
        settingSchema.cong_settings.attendance_deaf_record
    );

    await dbAppSettingsUpdate({
      'cong_settings.attendance_deaf_record': setValueForDataView(
        newRecordDeaf,
        dataView,
        !recordDeaf
      ),
    });
  };

  useEffect(() => {
    setRecordOnline(recordOnlineInitial);
  }, [recordOnlineInitial]);

  useEffect(() => {
    setRecordDeaf(recordDeafInitial);
  }, [recordDeafInitial]);

  return {
    recordOnline,
    handleRecordOnlineToggle,
    recordDeaf,
    handleRecordDeafToggle,
  };
};

export default useMeetingAttendance;
