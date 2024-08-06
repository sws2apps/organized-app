import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';
import { Tabs } from '@components/index';
import { lazy } from 'react';

const MidweekMeeting = lazy(
  () => import('@features/meetings/weekly_schedules/midweekMeeting')
);
const WeekendMeeting = lazy(
  () => import('@features/meetings/weekly_schedules/weekendMeeting')
);
const OutgoingTalks = lazy(
  () => import('@features/meetings/weekly_schedules/outgoingTalks')
);

const WeeklySchedules = () => {
  const { t } = useAppTranslation();

  const tabs = [
    {
      label: t('tr_midweekMeeting'),
      Component: <MidweekMeeting />,
    },
    {
      label: t('tr_weekendMeeting'),
      Component: <WeekendMeeting />,
    },
    {
      label: t('tr_outgoingTalks'),
      Component: <OutgoingTalks />,
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle title={t('tr_meetingSchedules')} />
      </Box>
      <Box
        sx={{
          marginTop: '16px',
          backgroundColor: 'var(--white)',
          padding: '15px',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
        }}
      >
        <Tabs tabs={tabs} />
      </Box>
    </>
  );
};

export default WeeklySchedules;
