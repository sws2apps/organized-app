import { Box } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useSpiritualStatus from './useSpiritualStatus';
import BaptizedPublisher from './baptized_publisher';
import Checkbox from '@components/checkbox';
import MidweekMeetingStudent from './midweek_meeting_student';
import Typography from '@components/typography';
import UnbaptizedPublisher from './unbaptized_publisher';

const PersonSpiritualStatus = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    person,
    handleToggleMidweekMeetingStudent,
    handleToggleUnbaptizedPublisher,
    handleToggleBaptizedPublisher,
    expandedStatus,
    handleToggleExpand,
    handleToggleArchive,
  } = useSpiritualStatus();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        flex: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <Typography className="h2">{t('tr_spiritualStatus')}</Typography>
        <Checkbox
          label={t('tr_archived')}
          checked={person.person_data.archived.value}
          onChange={handleToggleArchive}
          readOnly={!isPersonEditor}
        />
      </Box>

      <Box
        sx={{
          '& > .MuiBox-root': {
            borderTop: '1px solid var(--accent-200)',
            padding: '16px 0',
          },
          '& > .MuiBox-root:first-of-type': {
            borderTop: 'none',
          },
        }}
      >
        <BaptizedPublisher
          checked={person.person_data.publisher_baptized.active.value}
          onChange={handleToggleBaptizedPublisher}
          expanded={expandedStatus.baptized}
          onExpand={() => handleToggleExpand('baptized')}
        />

        <UnbaptizedPublisher
          checked={person.person_data.publisher_unbaptized.active.value}
          onChange={handleToggleUnbaptizedPublisher}
          expanded={expandedStatus.unbaptized}
          onExpand={() => handleToggleExpand('unbaptized')}
        />

        <MidweekMeetingStudent
          checked={person.person_data.midweek_meeting_student.active.value}
          onChange={handleToggleMidweekMeetingStudent}
          expanded={expandedStatus.midweek}
          onExpand={() => handleToggleExpand('midweek')}
        />
      </Box>
    </Box>
  );
};

export default PersonSpiritualStatus;
