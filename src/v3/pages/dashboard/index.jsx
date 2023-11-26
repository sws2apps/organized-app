import { Box } from '@mui/material';
import CongregationCard from './components/congregation';
import MinistryCard from './components/ministry';
import MeetingsCard from './components/meetings';
import MeetingsMaterialsCard from './components/meeting_materials';
import PersonsCard from './components/persons';
import ReportsCard from './components/reports';
import { TextMarkup, Typography } from '@components';
import { useAppTranslation } from '@hooks/index';
import useDashboard from './useDashboard';

const Dashboard = () => {
  const { t } = useAppTranslation();

  const { firstName } = useDashboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <Typography variant="h1">{t('dashboardGreeting', { firstName })} &#128075;</Typography>
        <TextMarkup
          content={t('dashboardMeetingAssignments', { assignment: 3 })}
          className="h3"
          anchorClassName="h3"
          anchorColor="var(--accent-main)"
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '24px',
        }}
      >
        <MinistryCard />
        <MeetingsCard />
        <PersonsCard />
        <MeetingsMaterialsCard />
        <ReportsCard />
        <CongregationCard />
      </Box>
    </Box>
  );
};

export default Dashboard;
