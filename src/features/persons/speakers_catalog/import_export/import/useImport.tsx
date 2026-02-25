import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from '../confirm_import/useCSVImport';
// WICHTIG: Hier die Speaker-Config importieren
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import type { ImportType } from './index.types';

const useImport = (props: ImportType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setFileData = props.setFileData;
  const onNext = props.onNext;

  // 1. Zugriff auf Speaker-Metadaten
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();
  const { getCSVHeaders, getExcelHeaders } = useCSVImport();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        setIsProcessing(true);

        if (acceptedFiles.length !== 1) {
          throw new Error(
            acceptedFiles.length === 0
              ? 'error_app_data_no-file-selected'
              : 'error_app_data_multiple-files-not-supported'
          );
        }

        const file = acceptedFiles[0];
        const isExcel = file.name.toLowerCase().endsWith('.xlsx');

        // Für CSV: Textinhalt lesen; für Excel: leer lassen
        const contents = isExcel ? '' : await file.text();

        // Header auslesen – je nach Dateityp
        let csvHeaders: string[];
        if (isExcel) {
          csvHeaders = await getExcelHeaders(file); // Neue Funktion aus useCSVImport
        } else {
          csvHeaders = getCSVHeaders(contents);
        }

        // Felder automatisch auswählen, wenn sie im Header vorhanden sind
        const selectedFields: Record<string, boolean> = {};
        for (const f of SPEAKER_FIELD_META.filter((f) =>
          csvHeaders.includes(f.key)
        )) {
          selectedFields[f.key] = true;
        }

        const groups = [...new Set(SPEAKER_FIELD_META.map((f) => f.group))];
        const selected: Record<string, boolean> = {};

        for (const group of groups) {
          const groupHasFields = SPEAKER_FIELD_META.some(
            (f) => f.group === group && csvHeaders.includes(f.key)
          );
          selected[group] = groupHasFields;
        }

        setFileData({ file, contents, selectedFields, selected });
        setIsProcessing(false);
        onNext();
      } catch (error) {
        setIsProcessing(false);
        console.error(error);

        const errorMessage =
          typeof error.message === 'string' &&
          error.message.startsWith('error_')
            ? getMessageByCode(error.message)
            : error.message || 'An unexpected error occurred';

        displaySnackNotification({
          severity: 'error',
          header: getMessageByCode('error_app_generic-title'),
          message: errorMessage,
        });
      }
    },
    [setFileData, onNext, SPEAKER_FIELD_META, getCSVHeaders, getExcelHeaders]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
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
