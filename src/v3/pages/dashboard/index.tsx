import { Box } from '@mui/material';
import { SnackBar, TextMarkup, Typography } from '@components/index';
import { IconCheckCircle } from '@icons/index';
import CongregationCard from './components/congregation';
import MinistryCard from './components/ministry';
import MeetingsCard from './components/meetings';
import MeetingsMaterialsCard from './components/meeting_materials';
import PersonsCard from './components/persons';
import ReportsCard from './components/reports';
import { useAppTranslation } from '@hooks/index';
import useDashboard from './useDashboard';

const Dashboard = () => {
  const { t } = useAppTranslation();

  const { firstName, isCongNew, handleCloseNewCongNotice } = useDashboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <Typography className="h1">{t('tr_greeting', { firstName })} &#128075;</Typography>
        <TextMarkup
          content={t('tr_meetingAssignments', { assignment: 3 })}
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

      {isCongNew && (
        <SnackBar
          open={isCongNew}
          variant="success"
          messageIcon={<IconCheckCircle color="var(--always-white)" />}
          messageHeader={t('tr_welcomeCongregationTitle')}
          message={t('tr_welcomeCongregationDesc')}
          onClose={handleCloseNewCongNotice}
        />
      )}
    </Box>
  );
};

export default Dashboard;
