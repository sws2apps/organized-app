import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';

type IosInstallDialogProps = {
  open: boolean;
  onClose: VoidFunction;
};

const IosInstallDialog = ({ open, onClose }: IosInstallDialogProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <Typography className="h2">{t('tr_installAppIosTitle')}</Typography>

      <Stack spacing="4px" width="100%">
        <TextMarkup
          content={t('tr_installAppIosDesc')}
          className="body-regular"
          color="var(--grey-400)"
        />
      </Stack>

      <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
        {t('tr_ok')}
      </Button>
    </Dialog>
  );
};

export default IosInstallDialog;
