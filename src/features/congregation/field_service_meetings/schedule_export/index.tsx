import { useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import Radio from '@components/radio';
import Button from '@components/button';
import Dialog from '@components/dialog';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import WeekRangeSelector from '@features/meetings/week_range_selector';
import {
  ScheduleExportScope,
  ScheduleExportType,
} from '@features/congregation/field_service_meetings/schedule_export/index.types';
import useScheduleExport from '@features/congregation/field_service_meetings/schedule_export/useScheduleExport';

const ScheduleExport = ({ open, onClose }: ScheduleExportType) => {
  const { t } = useAppTranslation();
  const [selectedOption, setSelectedOption] =
    useState<ScheduleExportScope>('all');

  const {
    isProcessing,
    handleExportSchedule,
    handleSetEndWeek,
    handleSetStartWeek,
    showValidationErrors,
    isStartWeekMissing,
    isEndWeekMissing,
    startWeek,
    endWeek,
    availableWeeks,
  } = useScheduleExport(onClose, selectedOption);

  return (
    <Dialog
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      open={open}
      title={t('tr_exportSchedule')}
      description={t('tr_selectScheduleToExport')}
      actions={
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
            endIcon={isProcessing ? <IconLoading /> : undefined}
            onClick={handleExportSchedule}
            // Clicking with no range marks the missing fields, so stay enabled.
            disabled={isProcessing}
          >
            {t('tr_next')}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            {t('tr_cancel')}
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Stack spacing="8px">
          <RadioGroup
            value={selectedOption}
            onChange={(e) =>
              setSelectedOption(e.target.value as ScheduleExportScope)
            }
            sx={{ gap: '8px' }}
          >
            <FormControlLabel
              sx={{ margin: 0 }}
              value="all"
              control={<Radio />}
              label={<Typography>{t('tr_allGroups')}</Typography>}
            />
            <FormControlLabel
              sx={{ margin: 0 }}
              value="specific"
              control={<Radio />}
              label={<Typography>{t('tr_specificGroups')}</Typography>}
            />
            <FormControlLabel
              sx={{ margin: 0 }}
              value="joint"
              control={<Radio />}
              label={<Typography>{t('tr_jointMeetings')}</Typography>}
            />
          </RadioGroup>
        </Stack>
        <WeekRangeSelector
          meeting="midweek"
          weeks={availableWeeks}
          onStartChange={handleSetStartWeek}
          onEndChange={handleSetEndWeek}
          startWeekError={showValidationErrors && isStartWeekMissing}
          endWeekError={showValidationErrors && isEndWeekMissing}
          startWeekHelperText={
            showValidationErrors && isStartWeekMissing
              ? t('tr_fillRequiredField')
              : undefined
          }
          endWeekHelperText={
            showValidationErrors && isEndWeekMissing
              ? t('tr_fillRequiredField')
              : undefined
          }
          startWeek={startWeek}
          endWeek={endWeek}
        />
      </Box>
    </Dialog>
  );
};

export default ScheduleExport;
