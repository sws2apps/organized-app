import { useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import Radio from '@components/radio';
import Button from '@components/button';
import Dialog from '@components/dialog';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import WeekRangeSelector from '../../../meetings/week_range_selector';
import { ScheduleExportScope, ScheduleExportType } from './index.types';
import useScheduleExport from './useScheduleExport';

const ScheduleExport = ({
  open,
  onClose,
  meeting = 'midweek',
}: ScheduleExportType) => {
  const { t } = useAppTranslation();
  const [selectedOption, setSelectedOption] =
    useState<ScheduleExportScope>('all');

  const {
    isProcessing,
    handleExportSchedule,
    handleSetEndWeek,
    handleSetStartWeek,
    isValid,
    showValidationErrors,
    isStartWeekMissing,
    isEndWeekMissing,
    startWeek,
    endWeek,
  } = useScheduleExport(onClose, selectedOption);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ padding: '32px', position: 'relative' }}
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
          <Typography className="h2">{t('tr_exportSchedule')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_selectScheduleToExport')}
          </Typography>
        </Box>

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
          meeting={meeting}
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
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedule}
          disabled={isProcessing || !isValid}
        >
          {t('tr_next')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ScheduleExport;
