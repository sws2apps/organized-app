import { Box } from '@mui/material';
import { PageHeader } from '@features/app_start';
import OAuth from '../oauth';
import { useAppTranslation } from '@hooks/index';
import useSignin from './useSignin';
import { Button, Typography } from '@components';
import { Markup } from 'interweave';

const Signin = () => {
  const { t } = useAppTranslation();

  const { handleSignUp, handleReturnChooser } = useSignin();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader title={t('login')} description={t('signInDesc')} onClick={handleReturnChooser} />

      <OAuth />

      <Button variant="secondary" onClick={handleSignUp} sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
        {t('createSwsAccount')}
      </Button>

      <Typography
        variant="body-small-regular"
        color="var(--grey-400)"
        sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}
      >
        <Markup content={t('oauthAccept')} />
      </Typography>
    </Box>
  );
};

export default Signin;
