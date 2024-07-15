import { Box } from '@mui/material';
import { IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ScheduleAutofillType } from './index.types';
import useScheduleAutofill from './useScheduleAutofill';
import Button from '@components/button';
import Dialog from '@components/dialog';
import ProgressBarSmall from '@components/progress_bar_small';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';

const ScheduleAutofillDialog = ({ open, onClose, meeting }: ScheduleAutofillType) => {
  const { t } = useAppTranslation();

  const {
    handleSetEndWeek,
    handleSetStartWeek,
    handleStartAutoFill,
    isProcessing,
    assignmentsTotal,
    assignmentsCurrent,
  } = useScheduleAutofill(meeting, onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{meeting === 'midweek' ? t('tr_autofillMM') : t('tr_autofillWM')}</Typography>
        <Typography color="var(--grey-400)">{t('tr_autofillDesc')}</Typography>
      </Box>

      <WeekRangeSelector meeting={meeting} onStartChange={handleSetStartWeek} onEndChange={handleSetEndWeek} />

      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <ProgressBarSmall value={assignmentsCurrent} maxValue={assignmentsTotal} />
          <Typography className="label-small-medium" sx={{ width: '48px' }} textAlign="right">
            {assignmentsCurrent}/{assignmentsTotal}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleStartAutoFill}
        >
          {t('tr_autofill')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ScheduleAutofillDialog;
