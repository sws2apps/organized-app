import { Box, Stack } from '@mui/material';
import { IconBackupOrganized, IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ExportType } from './index.types';
import useExport from './useExport';
import Button from '@components/button';
import Typography from '@components/typography';

const Export = (props: ExportType) => {
  const { t } = useAppTranslation();

  const { filename, isProcessing, handleDownload } = useExport();

  return (
    <Stack spacing="16px">
      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconBackupOrganized />
          <Typography className="h4" color="var(--accent-dark)">
            {filename}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing="8px">
        <Button
          variant="main"
          onClick={handleDownload}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_download')}
        </Button>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={props.onClose}
        >
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default Export;
