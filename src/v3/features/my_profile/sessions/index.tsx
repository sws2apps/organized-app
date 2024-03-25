import { Box } from '@mui/material';
import { SessionResponseType } from '@definition/api';
import Typography from '@components/typography';
import { ProfileItemContainer, SettingWithBorderContainer } from '../my_profile.styles';
import { useAppTranslation } from '@hooks/index';
import useSessions from './useSessions';
import SessionItem from './components/SessionItem';

const UserSessions = () => {
  const { t } = useAppTranslation();

  const { sessions } = useSessions();

  return (
    <ProfileItemContainer>
      <Box sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <Typography className="h2">{t('tr_sessions')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_sessionsDesc')}
        </Typography>
      </Box>

      <SettingWithBorderContainer>
        {sessions.map((session: SessionResponseType) => (
          <SessionItem key={session.visitorid} session={session} />
        ))}
      </SettingWithBorderContainer>
    </ProfileItemContainer>
  );
};

export default UserSessions;
