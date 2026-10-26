import { FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DutiesExportType } from './index.types';
import useDutiesExport from './useDutiesExport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import Radio from '@components/radio';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';

const DutiesExport = ({ open, onClose }: DutiesExportType) => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();

  const {
    canExport,
    isProcessing,
    orientation,
    fontSize,
    handleSetStartWeek,
    handleSetEndWeek,
    handleSetOrientation,
    handleSetFontSize,
    handleExportSchedules,
  } = useDutiesExport(onClose);

  const handleExport = () => handleExportSchedules({ orientation, fontSize });

  return (
    <Dialog
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      open={open}
      title={t('tr_exportDuties')}
      description={t('tr_exportDutiesDesc')}
      actions={
        <DialogActions>
          <Button variant="secondary" disabled={isProcessing} onClick={onClose}>
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            onClick={handleExport}
            disabled={isProcessing || !canExport}
            endIcon={isProcessing ? <IconLoading /> : undefined}
          >
            {t('tr_export')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="var(--dialog-gap)" sx={{ width: '100%' }}>
        <WeekRangeSelector
          meeting="duties"
          onStartChange={handleSetStartWeek}
          onEndChange={handleSetEndWeek}
        />

        <Stack
          direction={tablet600Down ? 'column' : 'row'}
          spacing="24px"
          sx={{ alignItems: 'flex-start' }}
        >
          <Stack spacing="8px" sx={{ flex: 1, width: '100%' }}>
            <Typography
              className="body-small-semibold"
              sx={{ color: 'var(--grey-400)' }}
            >
              {t('tr_orientation')}
            </Typography>
            <RadioGroup
              value={orientation}
              onChange={(e) =>
                handleSetOrientation(e.target.value as 'portrait' | 'landscape')
              }
              sx={{ gap: '8px' }}
            >
              <FormControlLabel
                value="portrait"
                label={<Typography>{t('tr_portrait')}</Typography>}
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                value="landscape"
                label={<Typography>{t('tr_landscape')}</Typography>}
                control={<Radio />}
                sx={{ margin: 0 }}
              />
            </RadioGroup>
          </Stack>

          <Stack spacing="8px" sx={{ flex: 1, width: '100%' }}>
            <Typography
              className="body-small-semibold"
              sx={{ color: 'var(--grey-400)' }}
            >
              {t('tr_fontSize')}
            </Typography>
            <RadioGroup
              value={String(fontSize)}
              onChange={(e) => handleSetFontSize(Number(e.target.value))}
              sx={{ gap: '8px' }}
            >
              <FormControlLabel
                value="8"
                label={<Typography>{t('tr_small')}</Typography>}
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                value="10"
                label={<Typography>{t('tr_normal')}</Typography>}
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                value="12"
                label={<Typography>{t('tr_large')}</Typography>}
                control={<Radio />}
                sx={{ margin: 0 }}
              />
            </RadioGroup>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default DutiesExport;
