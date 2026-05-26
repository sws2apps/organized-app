import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { AppLockCard, AppLockPage } from '../index.styles';
import useForgotPin from './useForgotPin';

const ForgotPin = () => {
  const { t } = useAppTranslation();

  const {
    email,
    isProcessing,
    handleEmailChange,
    handleBack,
    handleResetPin,
  } = useForgotPin();

  return (
    <AppLockPage>
      <AppLockCard>
        <Stack spacing={1}>
          <Typography className="h2">{t('tr_forgotPINTitle')}</Typography>
          <Typography className="body-regular" color="var(--grey-400)">
            {t('tr_forgotPINDesc')}
          </Typography>
        </Stack>

        <TextField
          label={t('tr_email')}
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          autoComplete="email"
        />

        <Stack spacing={1}>
          <Button
            variant="main"
            disabled={!email || isProcessing}
            onClick={handleResetPin}
            endIcon={
              isProcessing ? (
                <IconLoading width={22} height={22} color="var(--black)" />
              ) : undefined
            }
          >
            {t('tr_resetPIN')}
          </Button>
          <Button variant="secondary" onClick={handleBack}>
            {t('tr_back')}
          </Button>
        </Stack>
      </AppLockCard>
    </AppLockPage>
  );
};

export default ForgotPin;
