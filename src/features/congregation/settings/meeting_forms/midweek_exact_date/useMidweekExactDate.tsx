import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  meetingExactDateState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMidweekExactDate = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const exactDateInitial = useAtomValue(meetingExactDateState);

  const [displayExactDate, setDisplayExactDate] = useState(false);

  const handleDisplayExactDateToggle = async () => {
    let exactDate = structuredClone(
      settings.cong_settings.schedule_exact_date_enabled
    );

    if (!Array.isArray(exactDate)) {
      const updatedAt = exactDate['updatedAt'];
      const value = exactDate['value'];

      exactDate = [
        {
          type: 'main',
          updatedAt,
          _deleted: false,
          value,
        },
      ];
    }

    const findRecord = exactDate.find((record) => record.type === dataView);

    if (findRecord) {
      findRecord.value = !displayExactDate;
      findRecord.updatedAt = new Date().toISOString();
    }

    if (!findRecord) {
      exactDate.push({
        type: dataView,
        _deleted: false,
        updatedAt: new Date().toISOString(),
        value: !displayExactDate,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.schedule_exact_date_enabled': exactDate,
    });
  };

  useEffect(() => {
    setDisplayExactDate(exactDateInitial);
  }, [exactDateInitial]);

  return {
    displayExactDate,
    handleDisplayExactDateToggle,
  };
};

export default useMidweekExactDate;
