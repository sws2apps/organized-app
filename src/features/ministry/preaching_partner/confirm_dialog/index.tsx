import { useState } from 'react';
import { PreachingPartnerConfirmDialogProps } from '@features/ministry/preaching_partner/confirm_dialog/index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';

// every step that takes something away from a publisher asks first
const PreachingPartnerConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
}: PreachingPartnerConfirmDialogProps) => {
  const { t } = useAppTranslation();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await onConfirm();
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error && error.message.startsWith('tr_partner')
            ? error.message
            : 'tr_partnerActionFailed'
        ),
        severity: 'error',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      title={title}
      description={description}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
          {t('tr_cancel')}
        </Button>

        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing ? <IconLoading /> : undefined}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreachingPartnerConfirmDialog;
