//src/features/persons/speakers_catalog/import_export/import/useImport.tsx
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from '../confirm_import/useCSVImport';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import type { ImportType } from './index.types';

/**
 * Reads an uploaded CSV file and returns its text content, handling the
 * encodings that Excel typically produces.
 *
 * Strategy: decode as UTF-8 first and strip a UTF-8 BOM if present. If the
 * result contains the Unicode replacement character (U+FFFD), the file was
 * not valid UTF-8 and is decoded again as Windows-1252 – which covers
 * legacy CSV exports from Western European Excel installations.
 *
 * @param {File} file - The uploaded CSV file.
 * @returns {Promise<string>} The decoded text content.
 */
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
  if (hasUtf8Bom && text.codePointAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // If the replacement character (U+FFFD) is found, UTF-8 decoding failed
  // → Fallback to Windows-1252
  if (text.includes('\uFFFD')) {
    text = new TextDecoder('windows-1252').decode(bytes);
  }

  return text;
};

/**
 * Hook backing the upload step of the speakers import wizard. Accepts a
 * single CSV file via drag & drop or file picker, decodes it, reads its
 * headers and hands the prepared data – including a preselection of all
 * fields found in the file – to the confirm step via `setFileData`.
 */
const useImport = (props: ImportType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setFileData = props.setFileData;
  const onNext = props.onNext;

  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();
  const { getCSVHeaders } = useCSVImport();

  /**
   * Handles the dropzone result: validates the selection, decodes the file
   * and builds the initial field/group preselection from its headers.
   *
   * Follows the react-dropzone contract: files that fail validation (wrong
   * type, too large, more than one) arrive in `fileRejections` while
   * `acceptedFiles` stays empty – rejections therefore get their own error
   * message instead of the generic "no file selected" one.
   *
   * Errors thrown with an "error_…" code as message are translated via
   * getMessageByCode in the catch block; anything else is shown raw.
   *
   * @param {File[]} acceptedFiles - Files that passed the dropzone validation.
   * @param {FileRejection[]} fileRejections - Rejected files with their error reasons.
   */
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      try {
        setIsProcessing(true);

        if (fileRejections.length > 0) {
          throw new Error('error_app_data_invalid-file');
        }

        if (acceptedFiles.length !== 1) {
          throw new Error(
            acceptedFiles.length === 0
              ? 'error_app_data_no-file-selected'
              : 'error_app_data_multiple-files-not-supported'
          );
        }

        const file = acceptedFiles[0];

        const contents = await decodeCsvFile(file);

        const fileHeaders = getCSVHeaders(contents);

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
    [setFileData, onNext, SPEAKER_FIELD_META, getCSVHeaders]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 20971520, // 20 MB
    multiple: false,
  });

  return {
    getRootProps,
    getInputProps,
    isProcessing,
  };
};

export default useImport;
