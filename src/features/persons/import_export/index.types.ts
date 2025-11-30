export type ImportExportType = {
  open: boolean;
  onClose: VoidFunction;
};

export type ImportFileData = {
  file: File;
  contents: string;
  selectedFields?: Record<string, boolean>;
  selected?: Record<string, boolean>;
};

export type SetImportFileData = (data: ImportFileData | null) => void;

export type DialogType = 'import/export' | 'import/confirm';
