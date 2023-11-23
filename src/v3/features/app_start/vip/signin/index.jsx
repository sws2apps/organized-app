import { Box } from '@mui/material';
import { InfoMessage, TextMarkup } from '@components';
import { PageHeader } from '@features/app_start';
import OAuth from '../oauth';
import { useAppTranslation } from '@hooks/index';
import useSignin from './useSignin';
import { IconError } from '@icons';

const Signin = () => {
  const { t } = useAppTranslation();

  const { handleReturnChooser, hideMessage, message, title } = useSignin();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader title={t('login')} description={t('signInDesc')} onClick={handleReturnChooser} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box>
          <OAuth />

          <Box sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
            <TextMarkup content={t('oauthAccept')} className="body-small-regular" color="var(--grey-400)" />
          </Box>
        </Box>

        <Box id="onboarding-error" sx={{ display: 'none' }}>
          <InfoMessage
            variant="error"
            messageIcon={<IconError />}
            messageHeader={title}
            message={message}
            onClose={hideMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
