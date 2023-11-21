import { Box } from '@mui/material';
import { Button, TextMarkup } from '@components';
import { PageHeader } from '@features/app_start';
import OAuth from '../oauth';
import { useAppTranslation } from '@hooks/index';
import useSignin from './useSignin';

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

      <Box sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
        <TextMarkup content={t('oauthAccept')} className="body-small-regular" color="var(--grey-400)" />
      </Box>
    </Box>
  );
};

export default Signin;
