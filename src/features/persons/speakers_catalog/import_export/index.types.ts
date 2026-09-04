// src/features/persons/speakers_catalog/import_export/index.types.ts
export type ImportExportType = {
  open: boolean;
  onClose: VoidFunction;
};

export type ImportFileData = {
  file: File;
  contents: string;
  headers?: string[];
  selectedFields?: Record<string, boolean>;
  selected?: Record<string, boolean>;
};

export type SetImportFileData = (data: ImportFileData | null) => void;

export type DialogType = 'import/export' | 'import/confirm';
