import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from '../confirm_import/useCSVImport';
import usePersonsImportConfig from '../confirm_import/usePersonsImportConfig';
import type { ImportType } from './index.types';

const useImport = (props: ImportType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setFileData = props.setFileData;
  const onNext = props.onNext;
  const { PERSON_FIELD_META } = usePersonsImportConfig();
  const { getCSVHeaders } = useCSVImport();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        setIsProcessing(true);

        if (acceptedFiles.length !== 1) {
          throw new Error('error_app_data_invalid-file');
        }

        const file = acceptedFiles[0];
        const contents = await file.text();

        const csvHeaders = getCSVHeaders(contents);
        // all existing fields set to true as default
        const selectedFields = {};
        PERSON_FIELD_META.filter((f) => csvHeaders.includes(f.key)).forEach(
          (f) => {
            selectedFields[f.key] = true;
          }
        );

        // the same for groups
        const groups = [...new Set(PERSON_FIELD_META.map((f) => f.group))];
        const selected = {};
        groups.forEach((group) => {
          const groupHasFields = PERSON_FIELD_META.some(
            (f) => f.group === group && csvHeaders.includes(f.key)
          );
          selected[group] = groupHasFields;
        });
        setFileData({ file, contents, selectedFields, selected });
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
    [setFileData, onNext, PERSON_FIELD_META, getCSVHeaders]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    maxSize: 20971520,
    multiple: false,
  });

  const clearFile = () => setFileData(null);

  return {
    getRootProps,
    getInputProps,
    isProcessing,
    clearFile,
  };
};

export default useImport;
