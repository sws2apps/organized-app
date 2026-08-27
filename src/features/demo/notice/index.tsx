import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
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

      <DialogActions>
        <Button variant="secondary" onClick={handleOpenRealApp}>
          {t('tr_openRealApp')}
        </Button>

        <Button variant="main" onClick={handleClose}>
          {t('tr_testStart')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemoNotice;
