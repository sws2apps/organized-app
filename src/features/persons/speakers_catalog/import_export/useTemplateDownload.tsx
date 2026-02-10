import { useCallback } from 'react';
import { useAppTranslation } from '@hooks/index';
// WICHTIG: Hier importieren wir jetzt deine neue Config
import useSpeakersImportConfig from './confirm_import/useSpeakersImportConfig';
import {
  arrayInCsvSeparator,
  getCSVDelimiterByNumberFormat,
} from '@utils/csvFiles';
import { format, parseISO } from 'date-fns';
import useDateFormat from '@features/congregation/settings/meeting_forms/date_format/useDateFormat';

const useTemplateDownload = () => {
  const { t } = useAppTranslation();

  // Zugriff auf die Metadaten der Redner/Versammlungen
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const { shortDateFormat } = useDateFormat();

  const generateCSVTemplate = useCallback(() => {
    const delimiter = getCSVDelimiterByNumberFormat();

    // 1. Die technischen Schlüssel (z.B. "speaker.lastname")
    const headers = SPEAKER_FIELD_META.map((field) => field.key);

    // 2. Die übersetzten Labels (z.B. "Nachname")
    const translations = SPEAKER_FIELD_META.map((field) => t(field.label));

    // Maximale Anzahl der Beispiele ermitteln
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

        // Datum formatieren, falls ein Beispiel ein ISO-Datum ist
        if (isIsoDate(value)) {
          return format(parseISO(value), shortDateFormat);
        }

        // WICHTIG: Falls das Trennzeichen (z.B. Komma) im Wert vorkommt
        // (z.B. bei Vorträgen "1, 5, 10"), muss es escaped oder ersetzt werden,
        // damit die CSV-Spalten nicht verrutschen.
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

    const BOM = '\uFEFF'; // Byte Order Mark für korrekte Umlaute in Excel
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      // Name der Datei angepasst
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
    getCSVDelimiterByNumberFormat,
  };
};

export default useTemplateDownload;
