import { useRef } from 'react';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import IconLoading from '@components/icon_loading';
import PinInput, { PinInputHandle } from '../pin_input';
import { DialogActionsStack, PinFieldStack } from '../index.styles';
import useCreatePin from './useCreatePin';

type CreatePinProps = {
  open: boolean;
  mode?: 'create' | 'change';
  onClose: VoidFunction;
};

const PIN_LENGTH = 4;

const CreatePin = ({ open, mode = 'create', onClose }: CreatePinProps) => {
  const { t } = useAppTranslation();
  const pinRef = useRef<PinInputHandle>(null);

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
  } = useCreatePin(mode, onClose);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ onEntered: () => pinRef.current?.focus() }}
    >
      <Typography className="h1">{title}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {description}
      </Typography>

      <PinFieldStack sx={{ width: '100%' }}>
        <PinInput
          ref={pinRef}
          length={PIN_LENGTH}
          value={currentValue}
          onChange={handlePinChange}
          variant={hasError ? 'error' : 'default'}
          autoFocus={false}
        />
        <Typography className="body-small-regular" color="var(--red-dark)">
          {hasError && errorText ? errorText : ' '}
        </Typography>
      </PinFieldStack>

      <DialogActionsStack>
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
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </DialogActionsStack>
    </Dialog>
  );
};

export default CreatePin;
