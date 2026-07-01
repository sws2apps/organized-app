//src/features/persons/speakers_catalog/import_export/import/useImport.tsx
import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from '../confirm_import/useCSVImport';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import type { ImportType } from './index.types';

const decodeCsvFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const hasUtf8Bom =
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf;

  // Try UTF-8 first
  let text = new TextDecoder('utf-8').decode(bytes);

  // Remove BOM character (U+FEFF) at the beginning if present
  if (hasUtf8Bom && text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // If the replacement character (U+FFFD) is found, UTF-8 decoding failed
  // → Fallback to Windows-1252 (standard for German Excel CSV export)
  if (text.includes('\uFFFD')) {
    text = new TextDecoder('windows-1252').decode(bytes);
  }

  return text;
};

const useImport = (props: ImportType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setFileData = props.setFileData;
  const onNext = props.onNext;

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

        // For CSV: encoding-safe text content; for Excel: leave empty
        const contents = isExcel ? '' : await decodeCsvFile(file);

        // Read headers depending on the file type
        let fileHeaders: string[];
        if (isExcel) {
          fileHeaders = await getExcelHeaders(file);
        } else {
          fileHeaders = getCSVHeaders(contents);
        }

        // Automatically select fields if they exist in the header
        const selectedFields: Record<string, boolean> = {};
        for (const f of SPEAKER_FIELD_META.filter((f) =>
          fileHeaders.includes(f.key)
        )) {
          selectedFields[f.key] = true;
        }

        // Automatically select groups if their corresponding fields are present
        const groups = [...new Set(SPEAKER_FIELD_META.map((f) => f.group))];
        const selected: Record<string, boolean> = {};

        for (const group of groups) {
          const groupHasFields = SPEAKER_FIELD_META.some(
            (f) => f.group === group && fileHeaders.includes(f.key)
          );
          selected[group] = groupHasFields;
        }

        // Save data for ConfirmImport - including the processed headers
        setFileData({
          file,
          contents,
          headers: fileHeaders,
          selectedFields,
          selected,
        });
        setIsProcessing(false);
        onNext();
      } catch (error) {
        setIsProcessing(false);
        console.error(error);

        const errorMessage =
          typeof (error as Error).message === 'string' &&
          (error as Error).message.startsWith('error_')
            ? getMessageByCode((error as Error).message)
            : (error as Error).message || 'An unexpected error occurred';

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
    maxSize: 20971520, // 20 MB
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
