import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { ScheduleAutofillType } from './index.types';
import useScheduleAutofill from './useScheduleAutofill';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';

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
  } = useScheduleAutofill(meeting, onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">
          {meeting === 'midweek' ? t('tr_autofillMM') : t('tr_autofillWM')}
        </Typography>
        <Typography color="var(--grey-400)">{t('tr_autofillDesc')}</Typography>
      </Box>

      <WeekRangeSelector
        meeting={meeting}
        onStartChange={handleSetStartWeek}
        onEndChange={handleSetEndWeek}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleStartAutoFill}
        >
          {t('tr_autofill')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleAutofillDialog;
