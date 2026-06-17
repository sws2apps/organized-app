import { useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Dialog from '@components/dialog';
import Button from '@components/button';
import Radio from '@components/radio';
import Typography from '@components/typography';
import IconLoading from '@components/icon_loading';
import { ExportSettings } from './useExportGroups';

type ExportGroupsDialogProps = {
  open: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isProcessing: boolean;
};

const ExportGroupsDialog = ({
  open,
  onClose,
  onExport,
  isProcessing,
}: ExportGroupsDialogProps) => {
  const { t } = useAppTranslation();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [fontSize, setFontSize] = useState<number>(10);

  const handleExport = () => {
    onExport({ orientation, fontSize });
  };

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Stack spacing="24px" width="100%">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h2">{t('tr_exportSettings')}</Typography>
        </Box>

        {/* Page Orientation */}
        <Stack spacing="8px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_orientation')}
          </Typography>
          <RadioGroup
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
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

        {/* Font Size */}
        <Stack spacing="8px">
          <Typography className="body-small-semibold" color="var(--grey-400)">
            {t('tr_fontSize')}
          </Typography>
          <RadioGroup
            value={fontSize.toString()}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            sx={{ gap: '8px', marginLeft: '6px' }}
          >
            <FormControlLabel
              value="8"
              label={<Typography>{t('tr_small')} (8px)</Typography>}
              control={<Radio />}
            />
            <FormControlLabel
              value="10"
              label={<Typography>{t('tr_normal')} (10px)</Typography>}
              control={<Radio />}
            />
            <FormControlLabel
              value="12"
              label={<Typography>{t('tr_large')} (12px)</Typography>}
              control={<Radio />}
            />
          </RadioGroup>
        </Stack>

        {/* Action buttons */}
        <Stack spacing="8px" width="100%">
          <Button
            variant="main"
            onClick={handleExport}
            disabled={isProcessing}
            endIcon={isProcessing && <IconLoading />}
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
