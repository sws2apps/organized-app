import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import TextField from '@components/textfield';
import LockScreen from '../lock_screen';
import useForgotPin from './useForgotPin';

const ForgotPin = ({ open }: { open: boolean }) => {
  const { t } = useAppTranslation();

  const {
    email,
    isProcessing,
    errorText,
    handleEmailChange,
    handleBack,
    handleResetPin,
  } = useForgotPin();

  return (
    <LockScreen
      open={open}
      title={t('tr_PINForgotTitle')}
      description={t('tr_PINForgotDesc')}
    >
      <TextField
        label={t('tr_email')}
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleResetPin();
        }}
        error={errorText.length > 0}
        helperText={errorText}
      />

      <Stack spacing="8px">
        <Button
          variant="main"
          disabled={email.trim().length === 0 || isProcessing}
          onClick={handleResetPin}
          endIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {t('tr_PINReset')}
        </Button>

        <Button variant="secondary" onClick={handleBack}>
          {t('tr_back')}
        </Button>
      </Stack>
    </LockScreen>
  );
};

export default ForgotPin;
