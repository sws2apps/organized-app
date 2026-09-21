import { IconEncryptionKey } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { AccessCodeChangeType } from './index.types';
import useAccessCodeChange from './useAccessCodeChange';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import TextField from '@components/textfield';

const AccessCodeChange = ({ open, onClose }: AccessCodeChangeType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleChangeAccessCode,
    currentAccessCode,
    handleCurrentAccessCodeChange,
    newAccessCode,
    handleNewAccessCodeChange,
    confirmAccessCode,
    handleConfirmAccessCodeChange,
  } = useAccessCodeChange(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_changeAccessCode')}
      description={t('tr_changeAccessCodeDesc')}
    >
      <TextField
        type="password"
        label={currentAccessCode.length > 0 ? t('tr_accessCodeCurrent') : ''}
        placeholder={t('tr_accessCodeCurrent')}
        variant="outlined"
        autoComplete="off"
        value={currentAccessCode}
        onChange={(e) => handleCurrentAccessCodeChange(e.target.value)}
        startIcon={<IconEncryptionKey color="var(--black)" />}
        resetHelperPadding={true}
      />

      <TextField
        type="password"
        label={newAccessCode.length > 0 ? t('tr_accessCodeNew') : ''}
        placeholder={t('tr_accessCodeNew')}
        variant="outlined"
        autoComplete="off"
        value={newAccessCode}
        onChange={(e) => handleNewAccessCodeChange(e.target.value)}
        startIcon={<IconEncryptionKey color="var(--black)" />}
        resetHelperPadding={true}
      />

      <TextField
        type="password"
        label={confirmAccessCode.length > 0 ? t('tr_accessCodeConfirm') : ''}
        placeholder={t('tr_accessCodeConfirm')}
        variant="outlined"
        autoComplete="off"
        value={confirmAccessCode}
        onChange={(e) => handleConfirmAccessCodeChange(e.target.value)}
        startIcon={<IconEncryptionKey color="var(--black)" />}
        resetHelperPadding={true}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleChangeAccessCode}
        >
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessCodeChange;
