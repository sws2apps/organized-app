import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { IconBackupOrganized } from '@components/icons';
import IconLoading from '@components/icon_loading';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useExportSpeakers from './useExportSpeakers';
import type { ExportType } from './index.types';

const ExportSpeakers = (props: ExportType) => {
  const { t } = useAppTranslation();
  const { fileNameXlsx, fileNameCsv, isProcessing, handleExport } =
    useExportSpeakers();

  const handleExcelExport = async () => {
    if (isProcessing) return;
    await handleExport('xlsx');
  };

  const handleCSVExport = async () => {
    if (isProcessing) return;
    await handleExport('csv');
  };

  return (
    <Stack spacing="16px">
      {/* Box für die Excel-Datei */}
      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        onClick={handleExcelExport}
        sx={{
          cursor: isProcessing ? 'default' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: isProcessing ? 'var(--accent-150)' : 'var(--accent-200)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isProcessing ? (
            <IconLoading color="var(--accent-dark)" />
          ) : (
            <IconBackupOrganized color="var(--accent-dark)" />
          )}
          <Typography className="h4" color="var(--accent-dark)">
            {fileNameXlsx}
          </Typography>
        </Box>
      </Stack>

      {/* Box für die CSV-Datei */}
      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        onClick={handleCSVExport}
        sx={{
          cursor: isProcessing ? 'default' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: isProcessing ? 'var(--accent-150)' : 'var(--accent-200)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isProcessing ? (
            <IconLoading color="var(--accent-dark)" />
          ) : (
            <IconBackupOrganized color="var(--accent-dark)" />
          )}
          <Typography className="h4" color="var(--accent-dark)">
            {fileNameCsv}
          </Typography>
        </Box>
      </Stack>

      {/* Abbrechen-Button */}
      <Stack spacing="8px">
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

export default ExportSpeakers;
