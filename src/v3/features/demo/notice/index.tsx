import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import useNotice from './useNotice';

const DemoNotice = () => {
  const { t } = useAppTranslation();

  const { handleClose, open } = useNotice();

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: '24px', maxWidth: '500px' }}>
      <Typography className="h2">{t('tr_testAppWelcome')}</Typography>
      <TextMarkup
        content={t('tr_testAppWelcomeDesc')}
        className="body-regular"
        color="var(--grey-400)"
        anchorClassName="h4"
      />

      <Button variant="main" onClick={handleClose} sx={{ width: '100%' }}>
        {t('tr_testStart')}
      </Button>
    </Dialog>
  );
};

export default DemoNotice;
