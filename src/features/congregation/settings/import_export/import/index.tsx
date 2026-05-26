import { Stack } from '@mui/material';
import { IconImportJson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ImportType } from './index.types';
import { DropZone, DropZoneContent, FileInfoRow } from './index.styles';
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
      <DropZone
        {...(isProcessing ? {} : getRootProps())}
        $hasFile={hasFile}
        $isProcessing={isProcessing}
      >
        {!isProcessing && <input {...getInputProps()} />}

        {!isProcessing && !hasFile && (
          <Stack>
            <DropZoneContent>
              <IconImportJson color="var(--accent-dark)" />
              <Typography className="button-caps" color="var(--accent-dark)">
                {t('tr_dragOrClick')}
              </Typography>
            </DropZoneContent>
            <Typography
              textAlign="center"
              className="label-small-regular"
              color="var(--accent-400)"
            >
              {t('tr_uploadJsonFile')}
            </Typography>
          </Stack>
        )}

        {!isProcessing && hasFile && (
          <FileInfoRow>
            <IconImportJson color="var(--accent-dark)" />
            <Typography className="h4" color="var(--accent-dark)">
              {backupFileName}
            </Typography>
          </FileInfoRow>
        )}

        {isProcessing && <WaitingLoader variant="standard" size={60} />}
      </DropZone>

      <Stack spacing="8px">
        <Button
          variant="main"
          disabled={!hasFile || isProcessing}
          onClick={handleNext}
        >
          {t('tr_next')}
        </Button>

        {!desktopUp && props.onClose && (
          <Button variant="secondary" onClick={props.onClose} disabled={isProcessing}>
            {t('tr_cancel')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default Import;
