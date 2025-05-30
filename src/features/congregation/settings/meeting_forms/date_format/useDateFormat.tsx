import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  settingsState,
  shortDateFormatState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';

const useDateFormat = () => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const formatInitial = useAtomValue(shortDateFormatState);

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

    let current = shortDateFormat.find((record) => record.type === dataView);

    if (!current) {
      shortDateFormat.push({
        _deleted: false,
        type: dataView,
        updatedAt: '',
        value: '',
      });

      current = shortDateFormat.find((record) => record.type === dataView);
    }

    current.value = value;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.short_date_format': shortDateFormat,
    });

    // reload assignments history because of date format change
    const history = schedulesBuildHistoryList();
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
