import { useState } from 'react';
import { FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { PageType } from '@views/components/page/index.types';
import { DutiesExportType } from './index.types';
import useDutiesExport from './useDutiesExport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconLoading from '@components/icon_loading';
import Radio from '@components/radio';
import Typography from '@components/typography';
import WeekRangeSelector from '../week_range_selector';

const DutiesExport = ({ open, onClose }: DutiesExportType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleSetStartWeek,
    handleSetEndWeek,
    handleExportSchedules,
  } = useDutiesExport(onClose);

  const [orientation, setOrientation] =
    useState<PageType['orientation']>('portrait');
  const [fontSize, setFontSize] = useState(10);

  const handleExport = () => handleExportSchedules({ orientation, fontSize });

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Stack spacing="24px" width="100%">
        <Stack spacing="8px">
          <Typography className="h2">{t('tr_exportDuties')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_exportDutiesDesc')}
          </Typography>
        </Stack>

        <WeekRangeSelector
          meeting="duties"
          onStartChange={handleSetStartWeek}
          onEndChange={handleSetEndWeek}
        />

        <Stack spacing="8px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_orientation')}
          </Typography>
          <RadioGroup
            value={orientation}
            onChange={(e) =>
              setOrientation(e.target.value as PageType['orientation'])
            }
            sx={{ gap: '8px', marginLeft: '6px' }}
          >
            <FormControlLabel
              value="portrait"
              label={<Typography>{t('tr_portrait')}</Typography>}
              control={<Radio />}
            />
            <FormControlLabel
              value="landscape"
              label={<Typography>{t('tr_landscape')}</Typography>}
              control={<Radio />}
            />
          </RadioGroup>
        </Stack>

        <Stack spacing="8px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_fontSize')}
          </Typography>
          <RadioGroup
            value={String(fontSize)}
            onChange={(e) => setFontSize(Number(e.target.value))}
            sx={{ gap: '8px', marginLeft: '6px' }}
          >
            <FormControlLabel
              value="8"
              label={<Typography>{t('tr_small')}</Typography>}
              control={<Radio />}
            />
            <FormControlLabel
              value="10"
              label={<Typography>{t('tr_normal')}</Typography>}
              control={<Radio />}
            />
            <FormControlLabel
              value="12"
              label={<Typography>{t('tr_large')}</Typography>}
              control={<Radio />}
            />
          </RadioGroup>
        </Stack>

        <Stack spacing="8px" width="100%">
          <Button
            variant="main"
            onClick={handleExport}
            disabled={isProcessing}
            endIcon={isProcessing ? <IconLoading /> : undefined}
          >
            {t('tr_export')}
          </Button>
          <Button variant="secondary" disabled={isProcessing} onClick={onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default DutiesExport;
