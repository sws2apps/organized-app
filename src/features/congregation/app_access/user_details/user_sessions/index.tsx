import { Box } from '@mui/material';
import { DetailsContainer } from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import useUserSessions from './useUserSessions';
import SessionItem from '@features/my_profile/sessions/session_item';
import Typography from '@components/typography';

const UserSessions = () => {
  const { t } = useAppTranslation();

  const { handleTerminate, currentUser } = useUserSessions();

  return (
    <DetailsContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Typography className="h2">{t('tr_sessions')}</Typography>

          <Typography color="var(--grey-400)">
            {t('tr_terminateSessionAdminDesc')}
          </Typography>
        </Box>

        {currentUser.sessions.map((session) => (
          <SessionItem
            key={session.identifier}
            session={session}
            onTerminate={handleTerminate}
          />
        ))}
      </Box>
    </DetailsContainer>
  );
};

export default UserSessions;
