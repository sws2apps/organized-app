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

/**
 * Hook providing the downloadable CSV template for the speakers import.
 * The template mirrors the export layout: row 1 contains the technical
 * field keys, row 2 the localized labels, followed by the example rows
 * from the field configuration.
 */
const useTemplateDownload = () => {
  const { t } = useAppTranslation();

  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const { shortDateFormat } = useDateFormat();

  /**
   * Builds the template's CSV content.
   *
   * Layout matches the export format: a header row of technical keys, a
   * second row of localized labels (which the import detects and strips via
   * its translation-row heuristic), then one example row per example value
   * of each field. ISO dates in the examples are rendered in the user's
   * configured short date format. Example values containing the column
   * delimiter have it replaced by the in-field separator, so they never
   * break the column structure.
   *
   * @returns {string} The CSV content (without BOM).
   */
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

  /**
   * Triggers the download of the generated template as
   * "speakers_import_template.csv". A UTF-8 BOM is prepended so Excel
   * detects the encoding correctly. Does nothing in browsers without
   * download attribute support.
   */
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
    downloadTemplate,
  };
};

export default useTemplateDownload;
