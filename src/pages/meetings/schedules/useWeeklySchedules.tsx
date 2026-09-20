import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { WeeklySchedulesType } from './index.types';
import { settingsState, userDataViewState } from '@states/settings';
import MidweekContainer from '@features/meetings/weekly_schedules/midweek_container';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import WeekendContainer from '@features/meetings/weekly_schedules/weekend_container';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const useWeeklySchedules = () => {
  const { t } = useAppTranslation();

  useLocation();

  const scheduleType = localStorageGetItem(
    LOCALSTORAGE_KEY
  ) as WeeklySchedulesType;

  const { isAppointed } = useCurrentUser();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const outgoingVisible = useMemo(() => {
    if (isAppointed) return true;

    const weekend = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    return weekend.outgoing_talks_schedule_public.value;
  }, [isAppointed, settings, dataView]);

  const value = useMemo(() => {
    if (scheduleType === 'weekend') return 1;

    // the outgoing tab is not listed for everyone, so fall back to weekend
    if (scheduleType === 'outgoing') return outgoingVisible ? 2 : 1;

    return 0;
  }, [scheduleType, outgoingVisible]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_midweek'),
        Component: <MidweekContainer />,
      },
      {
        label: t('tr_weekend'),
        Component: <WeekendContainer />,
      },
    ];

    if (outgoingVisible) {
      result.push({
        label: t('tr_outgoingTalks'),
        Component: <OutgoingTalks />,
      });
    }

    return result;
  }, [outgoingVisible, t]);

  const handleScheduleChange = (value: number) => {
    let type: WeeklySchedulesType;

    if (value === 0) type = 'midweek';
    if (value === 1) type = 'weekend';
    if (value === 2) type = 'outgoing';

    localStorage.setItem(LOCALSTORAGE_KEY, type ?? 'midweek');
  };

  return { value, handleScheduleChange, tabs };
};

export default useWeeklySchedules;
