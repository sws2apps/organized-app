import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Box } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { settingsState, userDataViewState } from '@states/settings';
import useWeeklySchedules from './useWeeklySchedules';
import MidweekMeeting from '@features/meetings/weekly_schedules/midweek_meeting';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import PageTitle from '@components/page_title';
import ScrollableTabs from '@components/scrollable_tabs';
import WeekendMeeting from '@features/meetings/weekly_schedules/weekend_meeting';

const WeeklySchedules = () => {
  const { t } = useAppTranslation();

  const { value, handleScheduleChange } = useWeeklySchedules();

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

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_meetingSchedules')} />

      <Box
        sx={{
          backgroundColor: 'var(--white)',
          padding: '15px',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
        }}
      >
        <ScrollableTabs
          indicatorMode
          tabs={tabs}
          value={value}
          onChange={handleScheduleChange}
        />
      </Box>
    </Box>
  );
};

export default WeeklySchedules;
