import { useAppTranslation } from '@hooks/index';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import PinInput from '../pin_input';
import useCreatePin, { CreatePinMode } from './useCreatePin';

type CreatePinProps = {
  open: boolean;
  mode: CreatePinMode;
  onClose: VoidFunction;
};

const CreatePin = ({ open, mode, onClose }: CreatePinProps) => {
  const { t } = useAppTranslation();

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
  } = useCreatePin(mode, onClose);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <PinInput
        key={step}
        value={value}
        onChange={handlePinChange}
        onComplete={handleContinue}
        onSubmit={() => handleContinue()}
        error={errorText.length > 0}
        helperText={errorText}
        autoFocus
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>

        <Button
          variant="main"
          disabled={value.length < APP_LOCK_PIN_LENGTH || isProcessing}
          onClick={() => handleContinue()}
          endIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {continueLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePin;
