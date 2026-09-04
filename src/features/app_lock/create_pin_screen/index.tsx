import { Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import Typography from '@components/typography';
import PinInput from '../pin_input';
import { AppLockCard, AppLockPage, PinFieldStack } from '../index.styles';
import useCreatePinScreen from './useCreatePinScreen';

const PIN_LENGTH = 4;

/**
 * Shown after the PIN was reset through the passwordless link: the app lock
 * stays off until the user either creates a new PIN or turns the lock off on
 * purpose, so it can never end up disabled without the user knowing.
 */
const CreatePinScreen = () => {
  const { t } = useAppTranslation();

  const { tablet600Down } = useBreakpoints();

  const {
    title,
    description,
    currentValue,
    continueLabel,
    hasError,
    errorText,
    isProcessing,
    handlePinChange,
    handleContinue,
    handleTurnOff,
  } = useCreatePinScreen();

  return (
    <AppLockPage role="main" aria-label={title}>
      <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
        <AppLockCard role="region" aria-label={title}>
          <Stack spacing={1}>
            <Typography className="h1" id="create-pin-heading">
              {title}
            </Typography>
            <Typography className="body-regular" color="var(--grey-400)">
              {description}
            </Typography>
          </Stack>

          <PinFieldStack>
            <PinInput
              length={PIN_LENGTH}
              value={currentValue}
              onChange={handlePinChange}
              onSubmit={handleContinue}
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
              {hasError ? errorText : ''}
            </Typography>
          </PinFieldStack>

          <Stack spacing={1}>
            <Button
              variant="main"
              disabled={currentValue.length < PIN_LENGTH || isProcessing}
              onClick={handleContinue}
              endIcon={
                isProcessing ? (
                  <IconLoading width={22} height={22} color="var(--black)" />
                ) : undefined
              }
            >
              {continueLabel}
            </Button>
            <Button
              variant="secondary"
              disabled={isProcessing}
              onClick={handleTurnOff}
            >
              {t('tr_disableAppLock')}
            </Button>
          </Stack>
        </AppLockCard>
      </Stack>
    </AppLockPage>
  );
};

export default CreatePinScreen;
