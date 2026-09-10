import { useState } from 'react';
import { FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { FSGPageOrientation } from '@views/congregation/field_service_groups/index.types';
import { ExportGroupsDialogProps } from './index.types';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconLoading from '@components/icon_loading';
import Radio from '@components/radio';
import Typography from '@components/typography';

const ExportGroupsDialog = ({
  open,
  onClose,
  onExport,
  isProcessing,
}: ExportGroupsDialogProps) => {
  const { t } = useAppTranslation();

  const [orientation, setOrientation] =
    useState<FSGPageOrientation>('portrait');
  const [fontSize, setFontSize] = useState(10);

  const handleExport = () => onExport({ orientation, fontSize });

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Stack spacing="24px" width="100%">
        <Typography className="h2">{t('tr_exportSettings')}</Typography>

        <Stack spacing="8px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_orientation')}
          </Typography>
          <RadioGroup
            value={orientation}
            onChange={(e) =>
              setOrientation(e.target.value as FSGPageOrientation)
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

export default ExportGroupsDialog;
