// src/features/persons/speakers_catalog/import_export/useTemplateDownload.tsx
import { useCallback } from 'react';
import { useAppTranslation } from '@hooks/index';
import useSpeakersImportConfig from './confirm_import/useSpeakersImportConfig';
import {
  arrayInCsvSeparator,
  getCSVDelimiterByNumberFormat,
} from '@utils/csvFiles';
import { format, parseISO } from 'date-fns';
import useDateFormat from '@features/congregation/settings/meeting_forms/date_format/useDateFormat';

const useTemplateDownload = () => {
  const { t } = useAppTranslation();

  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const { shortDateFormat } = useDateFormat();

  const generateCSVTemplate = useCallback(() => {
    const delimiter = getCSVDelimiterByNumberFormat();

    const headers = SPEAKER_FIELD_META.map((field) => field.key);

    const translations = SPEAKER_FIELD_META.map((field) => t(field.label));

    const maxExamples = Math.max(
      ...SPEAKER_FIELD_META.map((field) =>
        field.examples ? field.examples.length : 0
      )
    );

    const isIsoDate = (value: string): boolean => {
      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    };

    const exampleRows: string[] = [];
    for (let i = 0; i < maxExamples; i++) {
      const row = SPEAKER_FIELD_META.map((field) => {
        const value = field.examples?.[i];

        if (typeof value !== 'string') return '';

        if (isIsoDate(value)) {
          return format(parseISO(value), shortDateFormat);
        }

        return value.split(delimiter).join(arrayInCsvSeparator());
      });
      exampleRows.push(row.join(delimiter));
    }

    return [
      headers.join(delimiter),
      translations.join(delimiter),
      ...exampleRows,
    ].join('\n');
  }, [SPEAKER_FIELD_META, t, shortDateFormat]);

  const downloadTemplate = useCallback(() => {
    const csvContent = generateCSVTemplate();

    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'speakers_import_template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  }, [generateCSVTemplate]);

  return {
    generateCSVTemplate,
    downloadTemplate,
  };
};

export default useTemplateDownload;
