import { Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import Typography from '@components/typography';
import PinInput from '../pin_input';
import { AppLockCard, AppLockPage, PinFieldStack } from '../index.styles';
import useUnlockScreen from './useUnlockScreen';

const UnlockScreen = ({ isExiting = false }: { isExiting?: boolean }) => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();

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
    <AppLockPage role="main" aria-label={t('tr_enterPinToUnlock')} exiting={isExiting}>
      <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
        <AppLockCard role="region" aria-label={t('tr_enterPinToUnlock')} exiting={isExiting}>
          <Stack spacing={1}>
            <Typography className="h1" id="unlock-heading">
              {t('tr_enterPinToUnlock')}
            </Typography>
            <Typography className="body-regular" color="var(--grey-400)">
              {t('tr_enterPinToUnlockDesc')}
            </Typography>
          </Stack>

          <PinFieldStack>
            <PinInput
              length={pinLength}
              value={pin}
              onChange={handlePinChange}
              onSubmit={() => handleUnlock()}
              variant={hasError ? 'error' : 'default'}
              autoFocus={!tablet600Down}
            />
            <Typography
              className="body-small-regular"
              color="var(--red-dark)"
              role="alert"
              aria-live="assertive"
              sx={{ minHeight: '20px', display: 'block' }}
            >
              {hasError ? t('tr_wrongPINTryAgain') : ''}
            </Typography>
          </PinFieldStack>

          <Stack spacing={1}>
            {biometricEnabled && (
              <Button
                variant="secondary"
                onClick={handleBiometric}
                disabled={isProcessing}
                aria-label={t('tr_biometricUnlock')}
              >
                {t('tr_biometricUnlock')}
              </Button>
            )}
            <Button
              variant="main"
              disabled={pin.length < pinLength || isProcessing}
              onClick={() => handleUnlock()}
              aria-label={t('tr_unlock')}
            >
              {t('tr_unlock')}
            </Button>
          </Stack>
        </AppLockCard>

        <Button
          variant="secondary"
          onClick={handleForgot}
          aria-label={t('tr_forgotYourPIN')}
        >
          {t('tr_forgotYourPIN')}
        </Button>
      </Stack>
    </AppLockPage>
  );
};

export default UnlockScreen;
