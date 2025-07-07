import { useRef, useState } from 'react';
import { Box, DialogActions, Stack } from '@mui/material';
import Dialog from '@components/dialog';
import Button from '@components/button';
import usePersonsImport from './useImportPersons';
import { useAppTranslation } from '@hooks/index';
import { IconUpload } from '@components/icons';
import Typography from '@components/typography';

const PersonsImport = () => {
  const { t } = useAppTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { handleCsvImport, handleDownloadTemplate } = usePersonsImport();

  const handleImportClick = () => {
    setIsDialogOpen(true);
  };

  const handleFileSelect = () => {
    setIsDialogOpen(false);
    fileInputRef.current?.click();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box>
      <Button
        variant="main"
        startIcon={<IconUpload />}
        onClick={handleImportClick}
      >
        {t('tr_import')}
      </Button>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <Stack spacing="16px">
          <Typography className="h2">{t('tr_fileImport')}</Typography>

          <Typography
            variant="body1"
            gutterBottom
            sx={{ whiteSpace: 'pre-line' }}
            color="var(--grey-400)"
          >
            {t('tr_csvImportDescription')}
          </Typography>

          <DialogActions>
            <Button variant="secondary" onClick={handleDialogClose}>
              {t('tr_cancel')}
            </Button>
            <Button
              variant="main"
              onClick={handleDownloadTemplate}
              // startIcon={<Download />}
            >
              {t('tr_templateDownload')}
            </Button>
            <Button variant="main" onClick={handleFileSelect}>
              {t('tr_fileChoose')}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept=".csv"
        onChange={handleCsvImport}
      />
    </Box>
  );
};

export default PersonsImport;
