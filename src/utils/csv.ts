import Papa from 'papaparse';
import type { CsvExportOptions, CsvRow } from '@definition/csv';

const ENCODING_COLUMN = '_organized_csv_encoding';
const ENCODING_VERSION = 'apostrophe-v1';

const needsEscape = (value: string) =>
  value.startsWith("'") ||
  /^[\t\r\n]/.test(value) ||
  /^\s*[=+\-@]/u.test(value);

const encodeCell = (value: string) =>
  needsEscape(value) ? `'${value}` : value;

/**
 * The marker scopes decoding to our exports. Escaping literal leading
 * apostrophes too makes the formula prefix reversible; legacy rows stay intact.
 */
export const exportCsv = (
  headers: string[],
  rows: string[][],
  { delimiter = ',', labels }: CsvExportOptions = {}
) =>
  Papa.unparse(
    [[...headers, ENCODING_COLUMN], ...(labels ? [labels] : []), ...rows].map(
      (row, index) =>
        index === 0 ? row : [...row.map(encodeCell), ENCODING_VERSION]
    ),
    { delimiter, newline: '\n', quotes: true, header: false }
  );

const decodeRow = (row: CsvRow): CsvRow => {
  if (row[ENCODING_COLUMN] !== ENCODING_VERSION) return row;

  return Object.fromEntries(
    Object.entries(row)
      .filter(([key]) => key !== ENCODING_COLUMN)
      .map(([key, value]) => [
        key,
        typeof value === 'string' &&
        value.startsWith("'") &&
        needsEscape(value.slice(1))
          ? value.slice(1)
          : value,
      ])
  );
};

export const parseCsv = (text: string, preview?: number) => {
  // Explicit fallback keeps a single-column legacy file from failing autodetection.
  const delimiter =
    Papa.parse(text, {
      preview: 1,
      delimiter: '',
      skipEmptyLines: 'greedy',
    }).meta.delimiter || ',';
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    delimiter,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    preview,
  });
  parsed.data = parsed.data
    .map(decodeRow)
    .filter((row) =>
      Object.values(row).some(
        (value) => typeof value !== 'string' || value.trim() !== ''
      )
    );
  parsed.meta.fields = parsed.meta.fields?.filter(
    (field) => field !== ENCODING_COLUMN
  );
  return parsed;
};
