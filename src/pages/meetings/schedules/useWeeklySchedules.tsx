import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { WeeklySchedulesType } from './index.types';
import { settingsState, userDataViewState } from '@states/settings';
import MidweekMeeting from '@features/meetings/weekly_schedules/midweek_meeting';
import WeekendMeeting from '@features/meetings/weekly_schedules/weekend_meeting';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const scheduleType = localStorageGetItem(
  LOCALSTORAGE_KEY
) as WeeklySchedulesType;

const useWeeklySchedules = () => {
  const { t } = useAppTranslation();

  const value = useMemo(() => {
    if (!scheduleType) return 0;

    if (scheduleType === 'midweek') return 0;
    if (scheduleType === 'weekend') return 1;
    if (scheduleType === 'outgoing') return 2;
  }, []);

  const { isAppointed } = useCurrentUser();

  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const outgoingVisible = useMemo(() => {
    if (isAppointed) return true;

    const weekend = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    return weekend.outgoing_talks_schedule_public.value;
  }, [isAppointed, settings, dataView]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_midweekMeeting'),
        Component: <MidweekMeeting />,
      },
      {
        label: t('tr_weekendMeeting'),
        Component: <WeekendMeeting />,
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

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
  };

  return { value, handleScheduleChange, tabs };
};

export default useWeeklySchedules;
