import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { ImportType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  backupFileContentsState,
  backupFileNameState,
  backupFileTypeState,
} from '@states/app';

const useImport = ({ onNext }: ImportType) => {
  const setBackupFileName = useSetRecoilState(backupFileNameState);
  const setBackupFileContents = useSetRecoilState(backupFileContentsState);
  const setBackupFileType = useSetRecoilState(backupFileTypeState);

  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        setIsProcessing(true);

        if (acceptedFiles.length !== 1) {
          throw new Error('error_app_data_invalid-file');
        }

        const file = acceptedFiles.at(0);
        const rawData = await file.text();
        const data = JSON.parse(rawData);

        const keys = Object.keys(data);

        const isCPE =
          keys.includes('app_settings') && keys.includes('fieldServiceReports');

        const isOrganized =
          keys.includes('name') && data['name'] === 'Organized';

        if (isCPE) {
          setBackupFileType('CPE');
        }

        if (isOrganized) {
          setBackupFileType('Organized');
        }

        if (!isCPE && !isOrganized) {
          throw new Error('error_app_data_invalid-file');
        }

        setBackupFileName(file.name);
        setBackupFileContents(JSON.stringify(data));

        onNext();
      } catch (error) {
        setIsProcessing(false);

        console.error(error);

        displaySnackNotification({
          severity: 'error',
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
        });
      }
    },
    [onNext, setBackupFileName, setBackupFileContents, setBackupFileType]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/json': ['.json'] },
    maxFiles: 1,
    maxSize: 20971520,
    multiple: false,
  });

  return { getRootProps, getInputProps, isProcessing };
};

export default useImport;
