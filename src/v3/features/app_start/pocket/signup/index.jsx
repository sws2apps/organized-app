import { Box } from '@mui/material';
import { Button, InfoMessage, TextField } from '@components';
import { PageHeader } from '@features/app_start';
import { IconError, IconLoading } from '@icons';
import useAppTranslation from '@hooks/useAppTranslation';
import useSignup from './useSignup';

const PocketSignUp = () => {
  const { t } = useAppTranslation();

  const {
    handleReturnChooser,
    handleSignUp,
    isOnline,
    isProcessing,
    setCode,
    visitorID,
    code,
    hideMessage,
    title,
    message,
    variant,
  } = useSignup();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={t('trans_connectCongregation')}
        description={t('trans_accountSetup')}
        onClick={handleReturnChooser}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField
            label={t('trans_invitationCode')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ width: '100%', color: 'var(--black)' }}
            className="h4"
          />
          <Button
            variant="main"
            disabled={code.length === 0 || !isOnline || visitorID.toString().length === 0}
            onClick={handleSignUp}
            sx={{ padding: '8px 32px', minHeight: '44px' }}
            startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
          >
            {t('trans_activate')}
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
