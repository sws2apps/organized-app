import { Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import LockScreen from '../lock_screen';
import PinInput from '../pin_input';
import useUnlockScreen from './useUnlockScreen';

const UnlockScreen = ({ open }: { open: boolean }) => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();

  const {
    pinRef,
    pin,
    hasError,
    helperText,
    unlockLabel,
    isProcessing,
    isCoolingDown,
    biometricEnabled,
    handlePinChange,
    handleUnlock,
    handleBiometric,
    handleForgot,
  } = useUnlockScreen();

  return (
    <LockScreen
      open={open}
      title={t('tr_PINUnlock')}
      description={t('tr_PINUnlockDesc')}
    >
      <PinInput
        ref={pinRef}
        value={pin}
        onChange={handlePinChange}
        onComplete={handleUnlock}
        onSubmit={() => handleUnlock()}
        error={hasError}
        helperText={helperText}
        disabled={isCoolingDown}
        autoFocus={!tablet600Down}
      />

      <Stack spacing="8px">
        <Button
          variant="main"
          disabled={pin.length < APP_LOCK_PIN_LENGTH || isProcessing}
          onClick={() => handleUnlock()}
          endIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {unlockLabel}
        </Button>

        {biometricEnabled && (
          <Button
            variant="tertiary"
            disabled={isProcessing}
            onClick={handleBiometric}
          >
            {t('tr_appLockBiometric')}
          </Button>
        )}

        <Button variant="secondary" onClick={handleForgot}>
          {t('tr_PINForgot')}
        </Button>
      </Stack>
    </LockScreen>
  );
};

export default UnlockScreen;
