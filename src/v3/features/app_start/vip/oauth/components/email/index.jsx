import { Box } from '@mui/material';
import { Typography } from '@components';
import { IconMail } from '@icons';
import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks';

const OAuthEmail = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        marginTop: { mobile: '0px', laptop: '8px' },
        display: 'flex',
        flexDirection: 'column',
        gap: { mobile: '16px', laptop: '32px' },
      }}
    >
      <Typography sx={{ textAlign: 'center' }}>{t('orLabel')}</Typography>
      <OAuthButtonBase isEmail={true} text={t('oauthEmail')} logo={<IconMail color="var(--black)" />} />
    </Box>
  );
};

export default OAuthEmail;
