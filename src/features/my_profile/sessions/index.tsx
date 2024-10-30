import { Box } from '@mui/material';
import { SessionResponseType } from '@definition/api';
import {
  ProfileItemContainer,
  SettingWithBorderContainer,
} from '../index.styles';
import { useAppTranslation } from '@hooks/index';
import useSessions from './useSessions';
import Typography from '@components/typography';
import SessionItem from './session_item';
import WaitingLoader from '@components/waiting_loader';

const UserSessions = () => {
  const { t } = useAppTranslation();

  const { sessions, errorMsg, isLoading, handleTerminate } = useSessions();

  return (
    <ProfileItemContainer>
      <Box sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <Typography className="h2">{t('tr_sessions')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_sessionsDesc')}
        </Typography>
      </Box>

      {isLoading && <WaitingLoader variant="standard" />}

      {errorMsg.length > 0 && (
        <Typography color="var(--red-main)">{errorMsg}</Typography>
      )}

      {!isLoading && sessions.length > 0 && (
        <SettingWithBorderContainer>
          {sessions.map((session: SessionResponseType) => (
            <SessionItem
              key={session.identifier}
              session={session}
              onTerminate={handleTerminate}
            />
          ))}
        </SettingWithBorderContainer>
      )}
    </ProfileItemContainer>
  );
};

export default UserSessions;
