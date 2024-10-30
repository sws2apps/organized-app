import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import useNotice from './useNotice';

const DemoNotice = () => {
  const { t } = useAppTranslation();

  const { handleClose, open, handleOpenRealApp } = useNotice();

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_testAppWelcome')}</Typography>
      <TextMarkup
        content={t('tr_testAppWelcomeDesc')}
        className="body-regular"
        color="var(--grey-400)"
        anchorClassName="h4"
      />

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleClose} sx={{ width: '100%' }}>
          {t('tr_testStart')}
        </Button>

        <Button
          variant="secondary"
          onClick={handleOpenRealApp}
          sx={{ width: '100%' }}
        >
          {t('tr_openRealApp')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default DemoNotice;
