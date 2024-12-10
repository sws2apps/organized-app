import { Box } from '@mui/material';
import { PageTitle } from '@components/index';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import usePersonDetails from './usePersonDetails';
import PersonAppUserProfile from '@features/persons/app_user_profile';
import PersonButtonActions from '@features/persons/button_actions';
import PersonBasicInfo from '@features/persons/basic_info';
import PersonEnrollments from '@features/persons/enrollments';
import PersonSpiritualStatus from '@features/persons/spiritual_status';
import PersonPrivileges from '@features/persons/privileges';
import PersonTimeAway from '@features/persons/time_away';
import PersonEmergencyContacts from '@features/persons/emergency_contacts';
import PersonAssignmentsHistory from '@features/persons/assignments_history';
import PersonAssignments from '@features/persons/assignments';

const PersonDetails = () => {
  const { t } = useAppTranslation();

  const { desktopUp, laptopUp } = useBreakpoints();

  const { isPersonEditor } = useCurrentUser();

  const { isNewPerson, isBaptized, male } = usePersonDetails();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={isNewPerson ? t('tr_addNewPerson') : t('tr_editPerson')}
        buttons={laptopUp ? <PersonButtonActions /> : null}
      />

      <Box
        sx={{
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            flex: 0.77,
            width: desktopUp ? 'auto' : '100%',
          }}
        >
          <PersonBasicInfo />
          {!isNewPerson && <PersonAppUserProfile />}
          <PersonSpiritualStatus />

          {isBaptized && (
            <Box
              sx={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--accent-300)',
                display: 'flex',
                padding: '16px',
                gap: '16px',
                flexDirection: 'column',
                borderRadius: 'var(--radius-xl)',
                flex: 1,
                width: '100%',
              }}
            >
              {male && <PersonPrivileges />}

              <PersonEnrollments />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <PersonAssignments />

          {!isNewPerson && <PersonAssignmentsHistory />}

          <PersonTimeAway />
          <PersonEmergencyContacts />
        </Box>
      </Box>

      {isPersonEditor && !laptopUp && (
        <Box
          sx={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}
        >
          <PersonButtonActions />
        </Box>
      )}
    </Box>
  );
};

export default PersonDetails;
