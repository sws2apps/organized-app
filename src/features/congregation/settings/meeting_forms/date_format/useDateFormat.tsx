import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  settingsState,
  shortDateFormatState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';

const useDateFormat = () => {
  const setAssignmentsHistory = useSetRecoilState(assignmentsHistoryState);

  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const formatInitial = useRecoilValue(shortDateFormatState);

  const [shortDateFormat, setShortDateFormat] = useState(formatInitial);

  const shortDateFormatOptions = useMemo(() => {
    return [
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'MM.dd.yyyy',
      'dd.MM.yyyy',
      'yyyy-MM-dd',
      'yyyy-dd-MM',
    ];
  }, []);

  const handleShortDateFormatChange = async (value: string) => {
    const shortDateFormat = structuredClone(
      settings.cong_settings.short_date_format
    );

    const current = shortDateFormat.find((record) => record.type === dataView);

    current.value = value;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.short_date_format': shortDateFormat,
    });

    // reload assignments history because of date format change
    const history = await schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  useEffect(() => {
    setShortDateFormat(formatInitial);
  }, [formatInitial]);

  return {
    shortDateFormat,
    handleShortDateFormatChange,
    shortDateFormatOptions,
  };
};

export default useDateFormat;
