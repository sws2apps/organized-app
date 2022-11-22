import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { UserChangePassword, User2FA, UserFullname, UserSessions } from './';

const subtitles = {
  fontWeight: 'bold',
  lineHeight: 1.2,
  paddingBottom: '5px',
};

const MyAccount = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography className={'settingHeader'}>{t('settings.myAccount')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ marginTop: '20px' }}>
        <UserFullname />
      </Box>
      <Typography sx={subtitles}>{t('settings.changePassword')}</Typography>
      <Divider />
      <UserChangePassword />
      <Typography sx={subtitles}>{t('settings.twoFactor')}</Typography>
      <Divider />
      <User2FA />
      <Typography sx={subtitles}>{t('settings.sessions')}</Typography>
      <Divider />
      <UserSessions />
    </Box>
  );
};

export default MyAccount;
