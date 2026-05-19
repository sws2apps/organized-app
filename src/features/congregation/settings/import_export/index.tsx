import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ImportExportType } from './index.types';
import useImportExport from './useImportExport';
import ConfirmImport from './confirm_import';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Tabs from '@components/tabs';
import { CardSection, CardSectionHeader } from '../shared_styles';

const ImportExport = (props: ImportExportType) => {
  const { t } = useAppTranslation();

  const { tabs, handleTabChange, value, state, handleOpenImportExport } =
    useImportExport(props);

  const content = (
    <>
      {state === 'import/export' && (
        <Stack spacing="16px">
          {props.inline ? (
            <CardSectionHeader
              title={t('tr_importExportTitle')}
              description={value === 0 ? t('tr_exportDesc') : t('tr_importDesc')}
            />
          ) : (
            <>
              <Typography className="h2">{t('tr_importExportTitle')}</Typography>

              <Typography color="var(--grey-400)">
                {value === 0 ? t('tr_exportDesc') : t('tr_importDesc')}
              </Typography>
            </>
          )}

          <Box sx={{ marginBottom: props.inline ? '0px' : '-24px !important' }}>
            <Tabs tabs={tabs} onChange={handleTabChange} value={value} />
          </Box>
        </Stack>
      )}

      {state === 'import/confirm' && (
        <ConfirmImport
          onBack={handleOpenImportExport}
          onClose={props.onClose}
        />
      )}
    </>
  );

  if (props.inline) {
    return <CardSection>{content}</CardSection>;
  }

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      {content}
    </Dialog>
  );
};

export default ImportExport;
