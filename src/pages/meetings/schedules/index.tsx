import { Box } from '@mui/material';
import { getTranslation } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import useWeeklySchedules from './useWeeklySchedules';
import MidweekMeeting from '@features/meetings/weekly_schedules/midweek_meeting';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import PageTitle from '@components/page_title';
import ScrollableTabs from '@components/scrollable_tabs';
import WeekendMeeting from '@features/meetings/weekly_schedules/weekend_meeting';

const tabs = [
  {
    label: getTranslation({ key: 'tr_midweekMeeting' }),
    Component: <MidweekMeeting />,
  },
  {
    label: getTranslation({ key: 'tr_weekendMeeting' }),
    Component: <WeekendMeeting />,
  },
  {
    label: getTranslation({ key: 'tr_outgoingTalks' }),
    Component: <OutgoingTalks />,
  },
];

const WeeklySchedules = () => {
  const { t } = useAppTranslation();

  const { value, handleScheduleChange } = useWeeklySchedules();

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
