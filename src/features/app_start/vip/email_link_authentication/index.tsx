import { Box } from '@mui/material';
import Button from '@components/button';
import InfoMessage from '@components/info-message';
import { IconError } from '@icons/index';
import PageHeader from '@features/app_start/shared/page_header';
import useAppTranslation from '@hooks/useAppTranslation';
import useEmailLinkAuth from './useEmailLinkAuth';
import WaitingLoader from '@components/waiting_loader';
import useKeydownHandler from '@hooks/useKeydownHandler';

const EmailLinkAuthentication = () => {
  const { t } = useAppTranslation();

  const {
    completeEmailAuth,
    isProcessing,
    handleReturn,
    hideMessage,
    message,
    title,
    variant,
  } = useEmailLinkAuth();

  const { registerKeydownHandler } = useKeydownHandler();

  registerKeydownHandler('Enter', completeEmailAuth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader
        title={t('tr_emailAuth')}
        description={t('tr_emailAuthDescComplete')}
        onClick={handleReturn}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Button
            variant="main"
            onClick={completeEmailAuth}
            sx={{ padding: '8px 32px', minHeight: '44px' }}
            startIcon={
              isProcessing ? (
                <WaitingLoader
                  size={22}
                  color="var(--black)"
                  variant="standard"
                />
              ) : null
            }
          >
            {t('tr_login')}
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
