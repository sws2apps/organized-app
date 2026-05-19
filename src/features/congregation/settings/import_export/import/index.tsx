import { Box, Stack } from '@mui/material';
import { IconImportJson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ImportType } from './index.types';
import useImport from './useImport';
import Button from '@components/button';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

import { useAtomValue } from 'jotai';
import { backupFileNameState } from '@states/app';

const Import = (props: ImportType) => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();
  const { getInputProps, getRootProps, isProcessing, hasFile, handleNext } = useImport(props);
  const backupFileName = useAtomValue(backupFileNameState);

  return (
    <Stack spacing="16px">
      {!isProcessing && !hasFile && (
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
            gap: '8px',
            '&:hover': {
              backgroundColor: 'var(--accent-100)',
            },
          }}
        >
          <input {...getInputProps()} />

          <Stack>
            <Box
              sx={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconImportJson color="var(--accent-dark)" />
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

      {!isProcessing && hasFile && (
        <Stack
          spacing="16px"
          padding="16px"
          borderRadius="var(--radius-m)"
          bgcolor="var(--accent-150)"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconImportJson color="var(--accent-dark)" />
            <Typography className="h4" color="var(--accent-dark)">
              {backupFileName}
            </Typography>
          </Box>
        </Stack>
      )}

      {isProcessing && <WaitingLoader variant="standard" size={60} />}

      <Stack spacing="8px">
        <Button
          variant="main"
          disabled={!hasFile || isProcessing}
          onClick={handleNext}
        >
          {t('tr_next')}
        </Button>

        {!desktopUp && (
          <Button variant="secondary" onClick={props.onClose} disabled={isProcessing}>
            {t('tr_cancel')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default Import;
