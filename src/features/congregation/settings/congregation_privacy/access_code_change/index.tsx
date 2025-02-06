import { Box } from '@mui/material';
import { IconEncryptionKey } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { AccessCodeChangeType } from './index.types';
import useAccessCodeChange from './useAccessCodeChange';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextField from '@components/textfield';
import Typography from '@components/typography';

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
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_changeAccessCode')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_changeAccessCodeDesc')}
        </Typography>
      </Box>

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
          endIcon={isProcessing && <IconLoading />}
          onClick={handleChangeAccessCode}
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

export default AccessCodeChange;
