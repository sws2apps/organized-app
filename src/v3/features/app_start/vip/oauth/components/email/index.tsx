import { Box } from '@mui/material';
import { IconMail } from '@icons/index';
import Typography from '@components/typography';
import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks/index';

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
      <Typography sx={{ textAlign: 'center' }}>{t('tr_orLabel')}</Typography>
      <OAuthButtonBase isEmail={true} text={t('tr_oauthEmail')} logo={<IconMail color="var(--black)" />} />
    </Box>
  );
};

export default OAuthEmail;
