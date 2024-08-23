import { Box } from '@mui/material';
import { getTranslation } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import PageTitle from '@components/page_title';
import ScrollableTabs from '@components/scrollable_tabs';
import WeekendMeeting from '@features/meetings/weekly_schedules/weekend_meeting';
import WeekSelector from '@features/meetings/weekly_schedules/week_selector';

const tabs = [
  {
    label: getTranslation({ key: 'tr_midweekMeeting' }),
    Component: <WeekSelector />,
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
        <ScrollableTabs tabs={tabs} />
      </Box>
    </Box>
  );
};

export default WeeklySchedules;
