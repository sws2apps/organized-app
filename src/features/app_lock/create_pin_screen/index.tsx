import { Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import LockScreen from '../lock_screen';
import PinInput from '../pin_input';
import useCreatePinScreen from './useCreatePinScreen';

// after a PIN reset the app asks for a new PIN before it opens again
const CreatePinScreen = () => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();

  const {
    step,
    title,
    description,
    value,
    errorText,
    continueLabel,
    isProcessing,
    handlePinChange,
    handleContinue,
    handleTurnOff,
  } = useCreatePinScreen();

  return (
    <LockScreen open title={title} description={description}>
      <PinInput
        key={step}
        value={value}
        onChange={handlePinChange}
        onComplete={handleContinue}
        onSubmit={() => handleContinue()}
        error={errorText.length > 0}
        helperText={errorText}
        autoFocus={!tablet600Down}
      />

      <Stack spacing="8px">
        <Button
          variant="main"
          disabled={value.length < APP_LOCK_PIN_LENGTH || isProcessing}
          onClick={() => handleContinue()}
          endIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {continueLabel}
        </Button>

        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={handleTurnOff}
        >
          {t('tr_appLockDisable')}
        </Button>
      </Stack>
    </LockScreen>
  );
};

export default CreatePinScreen;
