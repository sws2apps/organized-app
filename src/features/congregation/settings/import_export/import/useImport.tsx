import { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { ImportType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  backupFileContentsState,
  backupFileNameState,
  backupFileTypeState,
  featureFlagsState,
} from '@states/app';

const useImport = ({ onNext }: ImportType) => {
  const setBackupFileName = useSetAtom(backupFileNameState);
  const setBackupFileContents = useSetAtom(backupFileContentsState);
  const setBackupFileType = useSetAtom(backupFileTypeState);

  const FEATURE_FLAGS = useAtomValue(featureFlagsState);

  const [isProcessing, setIsProcessing] = useState(false);

  // only a file that parsed and passed the format checks can be imported; the
  // dropzone accepting a file says nothing about its contents
  const [hasFile, setHasFile] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        setIsProcessing(true);

        // a previously validated backup must not survive a failed drop
        setHasFile(false);
        setBackupFileName('');
        setBackupFileContents('');
        setBackupFileType('');

        if (acceptedFiles.length !== 1) {
          throw new Error('error_app_data_invalid-file');
        }

        const file = acceptedFiles.at(0);
        if (!file) throw new Error('error_app_data_invalid-file');
        const rawData = await file.text();

        let data: Record<string, unknown>;

        try {
          data = JSON.parse(rawData);
        } catch {
          throw new Error('error_app_data_invalid-file');
        }

        const keys = Object.keys(data);

        const isOrganized =
          keys.includes('name') && data['name'] === 'Organized';

        const isHourglass =
          FEATURE_FLAGS['HOURGLASS_IMPORT'] &&
          keys.includes('congregation') &&
          keys.includes('publishers') &&
          keys.includes('privileges');

        if (FEATURE_FLAGS['HOURGLASS_IMPORT']) {
          if (isHourglass) {
            const congregation = data['congregation'] as Record<
              string,
              unknown
            >;

            const isEncrypted = Boolean(congregation['e2ekey']);

            if (isEncrypted) {
              throw new Error('error_app_data_encrypted-file');
            }
          }

          if (!isOrganized && !isHourglass) {
            throw new Error('error_app_data_invalid-file');
          }
        } else {
          if (!isOrganized) {
            throw new Error('error_app_data_invalid-file');
          }
        }

        setBackupFileType(isOrganized ? 'Organized' : 'Hourglass');
        setBackupFileName(file.name);
        setBackupFileContents(JSON.stringify(data));
        setHasFile(true);
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);

        console.error(error);

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        displaySnackNotification({
          severity: 'error',
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(errorMessage),
        });
      }
    },
    [setBackupFileName, setBackupFileContents, setBackupFileType, FEATURE_FLAGS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/json': ['.json'] },
    maxFiles: 1,
    maxSize: 20971520,
    multiple: false,
  });

  const handleNext = () => {
    if (!hasFile || isProcessing) return;

    onNext();
  };

  return { getRootProps, getInputProps, isProcessing, hasFile, handleNext };
};

export default useImport;
