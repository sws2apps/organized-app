export type CsvRow = Record<string, string>;

export type CsvExportOptions = {
  delimiter?: string;
  labels?: string[];
};
