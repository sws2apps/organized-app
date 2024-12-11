import { Box, Stack } from '@mui/material';
import { IconImportJson } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ImportType } from './index.types';
import useImport from './useImport';
import Button from '@components/button';
import Typography from '@components/typography';

const Import = (props: ImportType) => {
  const { t } = useAppTranslation();

  const { getInputProps, getRootProps } = useImport();

  return (
    <Stack spacing="16px">
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

      <Stack spacing="8px">
        <Button variant="main">{t('tr_next')}</Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default Import;
