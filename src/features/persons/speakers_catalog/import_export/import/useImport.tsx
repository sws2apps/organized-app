import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from '../confirm_import/useCSVImport';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import type { ImportType } from './index.types';

// Liest CSV-Dateien mit automatischer Encoding-Erkennung (UTF-8 oder Windows-1252)
const decodeCsvFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // UTF-8 BOM prüfen (EF BB BF)
  const hasUtf8Bom =
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf;

  // Erst UTF-8 versuchen
  let text = new TextDecoder('utf-8').decode(bytes);

  // BOM-Zeichen (U+FEFF) am Anfang entfernen, falls vorhanden
  if (hasUtf8Bom && text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Wenn Replacement-Char (U+FFFD) gefunden wurde, war UTF-8 falsch
  // → Fallback auf Windows-1252 (Standard bei deutschem Excel-CSV-Export)
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

        // Für CSV: Encoding-sicherer Textinhalt; für Excel: leer lassen
        const contents = isExcel ? '' : await decodeCsvFile(file);

        // Header je nach Dateityp auslesen
        let fileHeaders: string[];
        if (isExcel) {
          fileHeaders = await getExcelHeaders(file);
        } else {
          fileHeaders = getCSVHeaders(contents);
        }

        // Felder automatisch auswählen, wenn sie im Header vorhanden sind
        const selectedFields: Record<string, boolean> = {};
        for (const f of SPEAKER_FIELD_META.filter((f) =>
          fileHeaders.includes(f.key)
        )) {
          selectedFields[f.key] = true;
        }

        // Gruppen automatisch auswählen, wenn zugehörige Felder da sind
        const groups = [...new Set(SPEAKER_FIELD_META.map((f) => f.group))];
        const selected: Record<string, boolean> = {};

        for (const group of groups) {
          const groupHasFields = SPEAKER_FIELD_META.some(
            (f) => f.group === group && fileHeaders.includes(f.key)
          );
          selected[group] = groupHasFields;
        }

        // Daten für ConfirmImport speichern – mit fertigen Headern
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
