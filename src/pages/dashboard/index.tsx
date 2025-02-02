import { Box } from '@mui/material';
import { IconCheckCircle } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDashboard from './useDashboard';
import ActivitiesCard from './activities';
import CongregationCard from './congregation';
import FeatureFlag from '@components/feature_flag';
import Markup from '@components/text_markup';
import MinistryCard from './ministry';
import MeetingsCard from './meetings';
import MeetingsMaterialsCard from './meeting_materials';
import PersonsCard from './persons';
import ReportsCard from './reports';
import Snackbar from '@components/snackbar';
import Typography from '@components/typography';

const Dashboard = () => {
  const { t } = useAppTranslation();

  const {
    isMeetingEditor,
    isPublisher,
    isPersonViewer,
    isElder,
    isAttendanceEditor,
  } = useCurrentUser();

  const {
    firstName,
    handleOpenMyAssignments,
    countFutureAssignments,
    handleCloseNewCongNotice,
    newCongSnack,
  } = useDashboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <Typography className="h1">
          {t('tr_greeting', { firstName })} &#128075;
        </Typography>
        <Markup
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

        <FeatureFlag flag="UPCOMING_EVENTS">
          <ActivitiesCard />
        </FeatureFlag>

        {isPersonViewer && <PersonsCard />}

        {isMeetingEditor && <MeetingsMaterialsCard />}

        {(isElder || isAttendanceEditor) && <ReportsCard />}

        <CongregationCard />
      </Box>

      {newCongSnack && (
        <Snackbar
          open={newCongSnack}
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
