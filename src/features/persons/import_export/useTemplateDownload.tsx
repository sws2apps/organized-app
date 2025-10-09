import { useCallback } from 'react';
import { useAppTranslation } from '@hooks/index';
import usePersonsImportConfig from './confirm_import/usePersonsImportConfig';
import {
  arrayInCsvSeparator,
  getCSVDelimiterByNumberFormat,
} from '@utils/csvFiles';

const useTemplateDownload = () => {
  const { t } = useAppTranslation();
  const { PERSON_FIELD_META } = usePersonsImportConfig();

  const generateCSVTemplate = useCallback(() => {
    const delimiter = getCSVDelimiterByNumberFormat();

    const headers = PERSON_FIELD_META.map((field) => field.key);
    const translations = PERSON_FIELD_META.map((field) => t(field.label));

    const maxExamples = Math.max(
      ...PERSON_FIELD_META.map((field) =>
        field.examples ? field.examples.length : 0
      )
    );

    const exampleRows: string[] = [];
    for (let i = 0; i < maxExamples; i++) {
      const row = PERSON_FIELD_META.map((field) => {
        const value = field.examples?.[i];
        return typeof value === 'string'
          ? value.replace(
              getCSVDelimiterByNumberFormat(),
              arrayInCsvSeparator()
            )
          : '';
      });
      exampleRows.push(row.join(delimiter));
    }

    return [
      headers.join(delimiter),
      translations.join(delimiter),
      ...exampleRows,
    ].join('\n');
  }, [PERSON_FIELD_META, t]);

  const downloadTemplate = useCallback(() => {
    const csvContent = generateCSVTemplate();

    const BOM = '\uFEFF'; // Byte Order Mark für UTF-8
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'persons_import_template.csv');
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
