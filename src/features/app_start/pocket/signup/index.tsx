import { Box } from '@mui/material';
import { IconError } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useSignup from './useSignup';
import Button from '@components/button';
import InfoMessage from '@components/info-message';
import PageHeader from '@features/app_start/shared/page_header';
import TextField from '@components/textfield';
import WaitingLoader from '@components/waiting_loader';

const PocketSignUp = () => {
  const { t } = useAppTranslation();

  const {
    handleReturnChooser,
    handleValidate,
    isOnline,
    isProcessing,
    handleCodeChange,
    code,
    hideMessage,
    title,
    message,
    variant,
  } = useSignup();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={t('tr_connectCongregation')}
        description={t('tr_accountSetup')}
        onClick={handleReturnChooser}
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
          <TextField
            type="password"
            autoComplete="off"
            className="h4"
            label={t('tr_invitationCode')}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            sx={{ width: '100%', color: 'var(--black)' }}
          />
          <Button
            variant="main"
            disabled={code.length === 0 || !isOnline}
            onClick={handleValidate}
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
            {t('tr_activate')}
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

export default PocketSignUp;
