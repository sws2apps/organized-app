import { PreachingPartnerCalendarProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useAddToCalendar from './useAddToCalendar';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';

const PreachingPartnerCalendar = (props: PreachingPartnerCalendarProps) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleAddToCalendar } = useAddToCalendar(props);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={t('tr_addToCalendar')}
      description={t('tr_addToCalendarDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_noThanks')}
        </Button>

        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleAddToCalendar}
        >
          {t('tr_add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreachingPartnerCalendar;
