import { Box } from '@mui/material';
import { Button, InfoMessage } from '@components';
import { IconError, IconLoading } from '@icons';
import { PageHeader } from '@features/app_start';
import useAppTranslation from '@hooks/useAppTranslation';
import useEmailLinkAuth from './useEmailLinkAuth';

const EmailLinkAuthentication = () => {
  const { t } = useAppTranslation();

  const { completeEmailAuth, isProcessing, handleReturn, hideMessage, message, title, variant } = useEmailLinkAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader title={t('trans_emailAuth')} description={t('trans_emailAuthDescComplete')} onClick={handleReturn} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Button
            variant="main"
            onClick={completeEmailAuth}
            sx={{ padding: '8px 32px', minHeight: '44px' }}
            startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
          >
            {t('trans_login')}
          </Button>
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

export default EmailLinkAuthentication;
