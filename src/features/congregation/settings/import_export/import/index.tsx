import { Box, Stack } from '@mui/material';
import { IconImportJson } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ImportType } from './index.types';
import useImport from './useImport';
import Button from '@components/button';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const Import = (props: ImportType) => {
  const { t } = useAppTranslation();

  const { getInputProps, getRootProps, isProcessing } = useImport(props);

  return (
    <Stack spacing="16px">
      {!isProcessing && (
        <Box
          {...getRootProps()}
          sx={{
            border: '1px dashed var(--accent-dark)',
            borderRadius: '6px',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />

          <Stack>
            <Box
              sx={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <IconImportJson />
              <Typography className="button-caps" color="var(--accent-dark)">
                {t('tr_dragOrClick')}
              </Typography>
            </Box>
            <Typography
              textAlign="center"
              className="label-small-regular"
              color="var(--accent-400)"
            >
              {t('tr_uploadJsonFile')}
            </Typography>
          </Stack>
        </Box>
      )}

      {isProcessing && <WaitingLoader size={60} variant="standard" />}

      <Button variant="secondary" onClick={props.onClose}>
        {t('tr_cancel')}
      </Button>
    </Stack>
  );
};

export default Import;
