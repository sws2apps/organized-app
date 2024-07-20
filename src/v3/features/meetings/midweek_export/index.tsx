import { Box } from '@mui/material';
import { IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType } from './index.types';
import useAssignmentsDelete from './useMidweekExport';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import ScheduleRangeSelector from '../schedule_range_selector';

const MidweekExport = ({ open, onClose }: MidweekExportType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleExportSchedule, handleSetEndMonth, handleSetStartMonth, exportS140, exportS89, handleToggleS140, handleToggleS89 } =
    useAssignmentsDelete(onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{t('tr_exportMidweekMeeting')}</Typography>
        <Typography color="var(--grey-400)">{t('tr_exportMidweekMeetinDesc')}</Typography>
      </Box>

      <ScheduleRangeSelector onStartChange={handleSetStartMonth} onEndChange={handleSetEndMonth} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox label={t('tr_MMScheduleS140')} checked={exportS140} onChange={handleToggleS140} />
        <Checkbox label={t('tr_assignmentFormS89')} checked={exportS89} onChange={handleToggleS89} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Button variant="main" disabled={isProcessing} endIcon={isProcessing && <IconLoading />} onClick={handleExportSchedule}>
          {t('tr_export')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default MidweekExport;
