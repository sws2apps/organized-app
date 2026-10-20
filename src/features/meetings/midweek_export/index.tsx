import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType } from './index.types';
import useMidweekExport from './useMidweekExport';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Tabs from '@components/tabs';
import S89TemplateSelector from './S89TemplateSelector';
import S140TemplateSelector from './S140TemplateSelector';
import WeekRangeSelector from '../week_range_selector';

const MidweekExport = ({ open, onClose }: MidweekExportType) => {
  const { t } = useAppTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    isProcessing,
    handleExportSchedule,
    exportS140,
    exportS89,
    handleToggleS140,
    handleToggleS89,
    S89Template,
    S140Template,
    handleSelectS140Template,
    handleSelectS89Template,
    handleSetEndWeek,
    handleSetStartWeek,
  } = useMidweekExport(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      disableEnforceFocus={previewOpen}
      title={t('tr_exportMidweekMeeting')}
      description={t('tr_exportMidweekMeetinDesc')}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <WeekRangeSelector
          meeting="midweek"
          onStartChange={handleSetStartWeek}
          onEndChange={handleSetEndWeek}
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
                  onPreviewChange={setPreviewOpen}
                  onChange={(value) => handleSelectS140Template(value)}
                />
              ),
            },
            {
              label: t('tr_templateS89'),
              Component: (
                <S89TemplateSelector
                  selected={S89Template}
                  onPreviewChange={setPreviewOpen}
                  onChange={(value) => handleSelectS89Template(value)}
                />
              ),
            },
          ]}
        />
      </Box>

      <DialogActions>
        <Button variant="secondary" disabled={isProcessing} onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedule}
        >
          {t('tr_export')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MidweekExport;
