import { Box } from '@mui/material';
import { IconEncryptionKey } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { MasterKeyChangeType } from './index.types';
import useMasterKeyChange from './useMasterKeyChange';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

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
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_masterKeyChange')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_masterKeyChangeDesc')}
        </Typography>
      </Box>

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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
          onClick={handleChangeMasterKey}
        >
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default MasterKeyChange;
