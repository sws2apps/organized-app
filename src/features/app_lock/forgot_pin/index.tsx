import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { AppLockCard, AppLockPage } from '../index.styles';
import useForgotPin from './useForgotPin';

const ForgotPin = ({ isExiting = false }: { isExiting?: boolean }) => {
  const { t } = useAppTranslation();

  const {
    email,
    isProcessing,
    hasError,
    errorText,
    handleEmailChange,
    handleBack,
    handleResetPin,
  } = useForgotPin();

  return (
    <AppLockPage role="main" aria-label={t('tr_forgotPINTitle')} exiting={isExiting}>
      <AppLockCard role="region" aria-label={t('tr_forgotPINTitle')} exiting={isExiting}>
        <Stack spacing={1}>
          <Typography className="h1" id="forgot-pin-heading">
            {t('tr_forgotPINTitle')}
          </Typography>
          <Typography className="body-regular" color="var(--grey-400)">
            {t('tr_forgotPINDesc')}
          </Typography>
        </Stack>

        <TextField
          label={t('tr_email')}
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && email.trim() && !isProcessing) {
              e.preventDefault();
              handleResetPin();
            }
          }}
          autoComplete="email"
          error={hasError}
          helperText={hasError ? errorText : ' '}
        />

        <Stack spacing={1}>
          <Button
            variant="main"
            disabled={!email.trim() || isProcessing}
            onClick={handleResetPin}
            aria-label={t('tr_resetPIN')}
            endIcon={
              isProcessing ? (
                <IconLoading width={22} height={22} color="var(--black)" />
              ) : undefined
            }
          >
            {t('tr_resetPIN')}
          </Button>
          <Button
            variant="secondary"
            onClick={handleBack}
            aria-label={t('tr_back')}
          >
            {t('tr_back')}
          </Button>
        </Stack>
      </AppLockCard>
    </AppLockPage>
  );
};

export default ForgotPin;
