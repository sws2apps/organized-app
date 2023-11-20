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
    feedbackRef,
    wrongCode,
    errorMessage,
    hasError,
  } = useSignup();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title={t('connectCongregation')} description={t('accountSetup')} onClick={handleReturnChooser} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField
            label={t('invitationCode')}
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
            {t('activate')}
          </Button>
        </Box>

        <Box sx={{ display: 'none' }} ref={feedbackRef}>
          {wrongCode && (
            <InfoMessage
              variant="error"
              messageIcon={<IconError />}
              messageHeader={t('wrongInvitationCode')}
              message={t('checkInvitationCode')}
              onClose={hideMessage}
            />
          )}
          {hasError && (
            <InfoMessage
              variant="error"
              messageIcon={<IconError />}
              messageHeader={t('errorTryAgain')}
              message={errorMessage}
              onClose={hideMessage}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PocketSignUp;
