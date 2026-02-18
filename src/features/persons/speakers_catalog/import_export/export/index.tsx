// Export Component für Speakers
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
    await handleExport('xlsx');
  };

  const handleCSVExport = async () => {
    await handleExport('csv');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Stack spacing={2} alignItems="center">
        <IconBackupOrganized
          color="var(--accent-main)"
          width={48}
          height={48}
        />

        <Typography variant="h6">{t('tr_exportSpeakers')}</Typography>

        <Typography variant="body2" color="textSecondary">
          {t('tr_exportSpeakersDesc')}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={handleExcelExport}
          startIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {isProcessing ? t('tr_processing') : t('tr_downloadExcel')}
        </Button>

        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={handleCSVExport}
          startIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {isProcessing ? t('tr_processing') : t('tr_downloadCSV')}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          {t('tr_excelFile')}: {fileNameXlsx}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          •
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('tr_csvFile')}: {fileNameCsv}
        </Typography>
      </Stack>

      <Button variant="small" onClick={props.onClose} disabled={isProcessing}>
        {t('tr_cancel')}
      </Button>
    </Box>
  );
};

export default ExportSpeakers;
