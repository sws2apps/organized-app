import { Box } from '@mui/material';
import { SnackBar, TextMarkup, Typography } from '@components/index';
import { IconCheckCircle } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { isDemo } from '@constants/index';
import CongregationCard from './congregation';
import MinistryCard from './ministry';
import MeetingsCard from './meetings';
import MeetingsMaterialsCard from './meeting_materials';
import PersonsCard from './persons';
import ReportsCard from './reports';
import useDashboard from './useDashboard';
import { DemoNotice } from '@features/index';

const Dashboard = () => {
  const { t } = useAppTranslation();

  const { isMeetingEditor, isPublisher, isPersonViewer, isElder } =
    useCurrentUser();

  const {
    firstName,
    isCongNew,
    handleCloseNewCongNotice,
    handleOpenMyAssignments,
    countFutureAssignments,
  } = useDashboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <Typography className="h1">
          {t('tr_greeting', { firstName })} &#128075;
        </Typography>
        <TextMarkup
          content={
            countFutureAssignments === 0
              ? t('tr_noMeetingAssignments')
              : t('tr_meetingAssignments', {
                  assignment: countFutureAssignments,
                })
          }
          className="h3"
          anchorClassName="h3"
          anchorColor="var(--accent-main)"
          anchorClick={handleOpenMyAssignments}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '24px',
        }}
      >
        {isPublisher && <MinistryCard />}

        <MeetingsCard assignmentCount={countFutureAssignments} />

        {isPersonViewer && <PersonsCard />}

        {isMeetingEditor && <MeetingsMaterialsCard />}

        {isElder && <ReportsCard />}

        <CongregationCard />
      </Box>

      {isCongNew && !isDemo && (
        <SnackBar
          open={isCongNew}
          variant="success"
          messageIcon={<IconCheckCircle color="var(--always-white)" />}
          messageHeader={t('tr_welcomeCongregationTitle')}
          message={t('tr_welcomeCongregationDesc')}
          onClose={handleCloseNewCongNotice}
        />
      )}

      {isCongNew && isDemo && <DemoNotice />}
    </Box>
  );
};

export default Dashboard;
