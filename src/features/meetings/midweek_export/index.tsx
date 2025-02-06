import { Box, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType } from './index.types';
import useMidweekExport from './useMidweekExport';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import S89TemplateSelector from './S89TemplateSelector';
import S140TemplateSelector from './S140TemplateSelector';
import ScheduleRangeSelector from '../schedule_range_selector';

const MidweekExport = ({ open, onClose }: MidweekExportType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleExportSchedule,
    handleSetEndMonth,
    handleSetStartMonth,
    exportS140,
    exportS89,
    handleToggleS140,
    handleToggleS89,
    S89Template,
    S140Template,
    handleSelectS140Template,
    handleSelectS89Template,
  } = useMidweekExport(onClose);

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
          marginBottom: '110px',
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h2">{t('tr_exportMidweekMeeting')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_exportMidweekMeetinDesc')}
          </Typography>
        </Box>

        <ScheduleRangeSelector
          onStartChange={handleSetStartMonth}
          onEndChange={handleSetEndMonth}
        />

        <Stack spacing="8px">
          <Checkbox
            label={t('tr_MMScheduleS140')}
            checked={exportS140}
            onChange={handleToggleS140}
          />
          <Checkbox
            label={t('tr_assignmentFormS89')}
            checked={exportS89}
            onChange={handleToggleS89}
          />
        </Stack>

        <Tabs
          tabs={[
            {
              label: t('tr_templateS140'),
              Component: (
                <S140TemplateSelector
                  selected={S140Template}
                  onChange={(value) => handleSelectS140Template(value)}
                />
              ),
            },
            {
              label: t('tr_templateS89'),
              Component: (
                <S89TemplateSelector
                  selected={S89Template}
                  onChange={(value) => handleSelectS89Template(value)}
                />
              ),
            },
          ]}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: '24px',
        }}
      >
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedule}
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

export default MidweekExport;
