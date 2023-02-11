import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OAuthButtonBase from './OAuthButtonBase';
import emailIcon from '../../img/email.svg';

const OAuthEmail = () => {
  const { t } = useTranslation('ui');

  return (
    <Box sx={{ marginTop: '10px' }}>
      <Typography sx={{ marginBottom: '10px' }}>{t('providerNotAvailable')}</Typography>
      <OAuthButtonBase
        isEmail={true}
        text={t('oauthEmail')}
        buttonStyles={{
          backgroundColor: '#5F6A6A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#5F6A6A',
            color: '#FFFFFF',
          },
        }}
        logo={emailIcon}
      />
    </Box>
  );
};

export default OAuthEmail;
