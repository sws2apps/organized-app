export type ImportExportType = {
  open: boolean;
  onClose: VoidFunction;
  inline?: boolean;
};

export type DialogType = 'import/export' | 'import/confirm';
