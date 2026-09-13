import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { IconBackupOrganized } from '@components/icons';
import IconLoading from '@components/icon_loading';
import Button from '@components/button';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useExportPersons from './useExportPersons';
import type { ExportType } from './index.types';

const Export = (props: ExportType) => {
  const { t } = useAppTranslation();

  const { fileName, isProcessing, handleExport } = useExportPersons();

  return (
    <Stack spacing="16px">
      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconBackupOrganized color="var(--accent-dark)" />
          <Typography className="h4" color="var(--accent-dark)">
            {fileName}
          </Typography>
        </Box>
      </Stack>

      <DialogActions>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={props.onClose}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          onClick={handleExport}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_download')}
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default Export;
