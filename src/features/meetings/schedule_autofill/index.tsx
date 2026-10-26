import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { ScheduleAutofillType } from './index.types';
import useScheduleAutofill from './useScheduleAutofill';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import WeekRangeSelector from '../week_range_selector';

const TITLE_KEYS: Record<ScheduleAutofillType['meeting'], string> = {
  midweek: 'tr_autofillMM',
  weekend: 'tr_autofillWM',
  duties: 'tr_autofillDuties',
};

const ScheduleAutofillDialog = ({
  open,
  onClose,
  meeting,
}: ScheduleAutofillType) => {
  const { t } = useAppTranslation();

  const {
    handleSetEndWeek,
    handleSetStartWeek,
    handleStartAutoFill,
    isProcessing,
    canAutofill,
  } = useScheduleAutofill(meeting, onClose);

  return (
    <Dialog
      onClose={isProcessing ? undefined : onClose}
      open={open}
      title={t(TITLE_KEYS[meeting])}
      description={t('tr_autofillDesc')}
      actions={
        <DialogActions>
          <Button variant="secondary" disabled={isProcessing} onClick={onClose}>
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            disabled={isProcessing || !canAutofill}
            endIcon=<>{isProcessing && <IconLoading />}</>
            onClick={handleStartAutoFill}
          >
            {t('tr_autofill')}
          </Button>
        </DialogActions>
      }
    >
      <WeekRangeSelector
        meeting={meeting}
        onStartChange={handleSetStartWeek}
        onEndChange={handleSetEndWeek}
      />
    </Dialog>
  );
};

export default ScheduleAutofillDialog;
