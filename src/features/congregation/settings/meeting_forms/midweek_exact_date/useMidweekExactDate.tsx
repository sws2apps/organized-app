import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  meetingExactDateState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMidweekExactDate = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const exactDateInitial = useRecoilValue(meetingExactDateState);

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
