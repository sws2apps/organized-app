import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useMFADisable from './useMFADisable';

type MFADisableType = {
  open: boolean;
  onClose: VoidFunction;
};

const MFADisable = ({ open, onClose }: MFADisableType) => {
  const { t } = useAppTranslation();

  const { handleDisable2FA, isProcessing } = useMFADisable(onClose);

  return (
    <Dialog onClose={onClose} open={open}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="h2">{t('tr_2FADisable')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_2FADisableDesc')}
        </Typography>
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          color="red"
          onClick={handleDisable2FA}
          endIcon={
            isProcessing ? (
              <IconLoading width={22} height={22} color="var(--black)" />
            ) : null
          }
        >
          {t('tr_disable')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MFADisable;
