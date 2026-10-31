import { partnerDemoMode } from '@constants/index';
import { PreachingPartnerCalendarProps } from '@features/ministry/preaching_partner/add_to_calendar/index.types';
import { useAppTranslation } from '@hooks/index';
import useAddToCalendar from '@features/ministry/preaching_partner/add_to_calendar/useAddToCalendar';
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
      description={t(
        partnerDemoMode
          ? 'tr_partnerDemoCalendarDesc'
          : 'tr_partnerLiveCalendarDesc'
      )}
    >
      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_noThanks')}
        </Button>

        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing ? <IconLoading /> : undefined}
          onClick={handleAddToCalendar}
        >
          {t('tr_add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreachingPartnerCalendar;
