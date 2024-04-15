import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { User2FA, UserFullname, UserPocketSessions, UserVipSessions } from './';
import { accountTypeState } from '../../states/main';

const subtitles = {
  fontWeight: 'bold',
  lineHeight: 1.2,
  paddingBottom: '5px',
};

const MyAccount = () => {
  const { t } = useTranslation('ui');

  const accountType = useRecoilValue(accountTypeState);

  return (
    <Box>
      <Typography className={'settingHeader'}>{t('myAccount')}</Typography>
      <Divider sx={{ borderWidth: '5px' }} />
      <Box sx={{ marginTop: '20px' }}>
        <UserFullname />
      </Box>

      {accountType === 'vip' && (
        <>
          <Typography sx={subtitles}>{t('twoFactor')}</Typography>
          <Divider />
          <User2FA />
        </>
      )}

      <Typography sx={subtitles}>{t('sessions')}</Typography>
      <Divider />

      {accountType === 'pocket' && <UserPocketSessions />}
      {accountType === 'vip' && <UserVipSessions />}
    </Box>
  );
};

export default MyAccount;
