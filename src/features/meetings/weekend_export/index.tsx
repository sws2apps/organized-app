import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { WeekendExportType } from './index.types';
import useWeekendExport from './useWeekendExport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';
import Checkbox from '@components/checkbox';

const WeekendExport = ({ open, onClose }: WeekendExportType) => {
  const { t } = useAppTranslation();

  const {
    handleSetEndWeek,
    handleSetStartWeek,
    isProcessing,
    handleExportSchedules,
    toggleExportOutgoingSpeakersSchedule,
    toggleExportWeekendMeetingSchedule,
    exportOutgoingSpeakersScheduleIsChecked,
    exportWeekendMeetingScheduleIsChecked,
  } = useWeekendExport(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ padding: '24px', position: 'relative' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h2">{t('tr_exportWM')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_exportWMDesc')}
          </Typography>
        </Box>

        <WeekRangeSelector
          meeting="weekend"
          onStartChange={handleSetStartWeek}
          onEndChange={handleSetEndWeek}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Checkbox
          checked={exportWeekendMeetingScheduleIsChecked}
          onChange={toggleExportWeekendMeetingSchedule}
          label={t('tr_weekendMeetingPrint')}
        />
        <Checkbox
          checked={exportOutgoingSpeakersScheduleIsChecked}
          onChange={toggleExportOutgoingSpeakersSchedule}
          label={t('tr_outgoingSpeakersSchedule')}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedules}
        >
          {t('tr_export')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default WeekendExport;
