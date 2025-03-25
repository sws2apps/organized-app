import { Box } from '@mui/material';
import { IconCheckCircle } from '@icons/index';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useDashboard from './useDashboard';
import ActivitiesCard from './activities';
import CongregationCard from './congregation';
import FeatureFlag from '@components/feature_flag';
import LanguageGroupSelector from '@features/language_group_selector';
import Markup from '@components/text_markup';
import MinistryCard from './ministry';
import MeetingsCard from './meetings';
import MeetingsMaterialsCard from './meeting_materials';
import PersonsCard from './persons';
import ReportsCard from './reports';
import Snackbar from '@components/snackbar';
import Typography from '@components/typography';
import Button from '@components/button';
import { pdf } from '@react-pdf/renderer';
import TemplateUpcomingEvents from '@views/upcoming_events';
import { congNameState, JWLangLocaleState } from '@states/settings';
import { useRecoilValue } from 'recoil';
import saveAs from 'file-saver';

const Dashboard = () => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

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

  const locale = useRecoilValue(JWLangLocaleState);
  const congName = useRecoilValue(congNameState);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: tablet688Up ? 'center' : 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexDirection: tablet688Up ? 'row' : 'column',
        }}
      >
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

        <FeatureFlag flag="LANGUAGE_GROUPS">
          <LanguageGroupSelector />
        </FeatureFlag>
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

        <Button
          onClick={async () => {
            const blob = await pdf(
              <TemplateUpcomingEvents congregation={congName} lang={locale} />
            ).toBlob();

            const filename = `Field_Service_Groups.pdf`;

            saveAs(blob, filename);
          }}
        >
          Export
        </Button>
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
