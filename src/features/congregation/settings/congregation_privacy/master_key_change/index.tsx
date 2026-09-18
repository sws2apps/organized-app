import { IconEncryptionKey } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { MasterKeyChangeType } from './index.types';
import useMasterKeyChange from './useMasterKeyChange';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import TextField from '@components/textfield';

const MasterKeyChange = ({ open, onClose }: MasterKeyChangeType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleChangeMasterKey,
    currentMasterKey,
    handleCurrentMasterKeyChange,
    newMasterKey,
    handleNewMasterKeyChange,
    confirmMasterKey,
    handleConfirmMasterKeyChange,
  } = useMasterKeyChange(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_masterKeyChange')}
      description={t('tr_masterKeyChangeDesc')}
    >
      <TextField
        type="password"
        label={currentMasterKey.length > 0 ? t('tr_masterKeyCurrent') : ''}
        placeholder={t('tr_masterKeyCurrent')}
        variant="outlined"
        autoComplete="off"
        value={currentMasterKey}
        onChange={(e) => handleCurrentMasterKeyChange(e.target.value)}
        startIcon={<IconEncryptionKey color="var(--black)" />}
        resetHelperPadding={true}
      />

      <TextField
        type="password"
        label={newMasterKey.length > 0 ? t('tr_masterKeyNew') : ''}
        placeholder={t('tr_masterKeyNew')}
        variant="outlined"
        autoComplete="off"
        value={newMasterKey}
        onChange={(e) => handleNewMasterKeyChange(e.target.value)}
        startIcon={<IconEncryptionKey color="var(--black)" />}
        resetHelperPadding={true}
      />

      <TextField
        type="password"
        label={confirmMasterKey.length > 0 ? t('tr_masterKeyConfirm') : ''}
        placeholder={t('tr_masterKeyConfirm')}
        variant="outlined"
        autoComplete="off"
        value={confirmMasterKey}
        onChange={(e) => handleConfirmMasterKeyChange(e.target.value)}
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
          onClick={handleChangeMasterKey}
        >
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MasterKeyChange;
