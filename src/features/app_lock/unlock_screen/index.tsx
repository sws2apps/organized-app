import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import Typography from '@components/typography';
import PinInput from '../pin_input';
import { AppLockCard, AppLockPage, PinFieldStack } from '../index.styles';
import useUnlockScreen from './useUnlockScreen';

const UnlockScreen = () => {
  const { t } = useAppTranslation();

  const {
    pin,
    pinLength,
    isProcessing,
    hasError,
    biometricEnabled,
    handlePinChange,
    handleUnlock,
    handleBiometric,
    handleForgot,
  } = useUnlockScreen();

  return (
    <AppLockPage>
      <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
        <AppLockCard>
          <Stack spacing={1}>
            <Typography className="h1">{t('tr_enterPinToUnlock')}</Typography>
            <Typography className="body-regular" color="var(--grey-400)">
              {`🔒 ${t('tr_enterPinToUnlockDesc')} `}
            </Typography>
          </Stack>

          <PinFieldStack>
            <PinInput
              length={pinLength}
              value={pin}
              onChange={handlePinChange}
              onComplete={(value) => handleUnlock(value)}
              variant={hasError ? 'error' : 'default'}
            />
            <Typography className="body-small-regular" color="var(--red-dark)">
              {hasError ? t('tr_wrongPINTryAgain') : ' '}
            </Typography>
          </PinFieldStack>

          <Stack spacing={1}>
            {biometricEnabled && (
              <Button
                variant="secondary"
                onClick={handleBiometric}
                disabled={isProcessing}
              >
                {t('tr_biometricUnlock')}
              </Button>
            )}
            <Button
              variant="main"
              disabled={pin.length < pinLength || isProcessing}
              onClick={() => handleUnlock()}
              endIcon={
                isProcessing ? (
                  <IconLoading width={22} height={22} color="var(--black)" />
                ) : undefined
              }
            >
              {t('tr_unlock')}
            </Button>
          </Stack>
        </AppLockCard>

        <Button variant="secondary" onClick={handleForgot}>
          {t('tr_forgotYourPIN')}
        </Button>
      </Stack>
    </AppLockPage>
  );
};

export default UnlockScreen;
