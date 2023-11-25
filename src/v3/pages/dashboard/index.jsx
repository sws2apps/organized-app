import { Box } from '@mui/material';
import CongregationCard from './components/congregation';
import MinistryCard from './components/ministry';
import MeetingsCard from './components/meetings';
import MeetingsMaterialsCard from './components/meeting_materials';
import PersonsCard from './components/persons';
import ReportsCard from './components/reports';

const Dashboard = () => {
  return (
    <Box
      sx={{
        width: '100%',
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
  );
};

export default Dashboard;
