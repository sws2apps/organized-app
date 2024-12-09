import { useCallback } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useImport = () => {
  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    try {
      if (acceptedFiles.length !== 1) {
        displaySnackNotification({
          severity: 'error',
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode('error_app_data_invalid-file'),
        });

        return;
      }

      const file = acceptedFiles.at(0);

      const rawData = await file.text();
      const data = JSON.parse(rawData);

      console.log(data);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/json': ['.json'] },
    maxFiles: 1,
    maxSize: 20971520,
    multiple: false,
  });

  return { getRootProps, getInputProps };
};

export default useImport;
