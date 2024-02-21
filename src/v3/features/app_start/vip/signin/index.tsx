import { Box } from '@mui/material';
import InfoMessage from '@components/info-message';
import TextMarkup from '@components/text_markup';
import PageHeader from '@features/app_start/shared/page_header';
import OAuth from '../oauth';
import { useAppTranslation } from '@hooks/index';
import useSignin from './useSignin';
import { IconError } from '@icons/index';

const Signin = () => {
  const { t } = useAppTranslation();

  const { handleReturnChooser, hideMessage, message, title, variant } = useSignin();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader title={t('tr_login')} description={t('tr_signInDesc')} onClick={handleReturnChooser} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box>
          <OAuth />

          <Box sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
            <TextMarkup content={t('tr_oauthAccept')} className="body-small-regular" color="var(--grey-400)" />
          </Box>
        </Box>

        <Box id="onboarding-error" sx={{ display: 'none' }}>
          <InfoMessage
            variant={variant}
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
