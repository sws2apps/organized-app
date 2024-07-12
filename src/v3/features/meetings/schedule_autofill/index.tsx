import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ScheduleAutofillType } from './index.types';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';

const ScheduleAutofillDialog = ({ open, onClose, meeting }: ScheduleAutofillType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{meeting === 'midweek' ? t('tr_autofillMM') : t('tr_autofillWM')}</Typography>
        <Typography color="var(--grey-400)">{t('tr_autofillDesc')}</Typography>
      </Box>

      <WeekRangeSelector onStartChange={(value) => console.log(value)} onEndChange={(value) => console.log(value)} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Button variant="main">{t('tr_autofill')}</Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ScheduleAutofillDialog;
