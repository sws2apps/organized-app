import { SetImportFileData } from '../index.types';

export type ImportType = {
  setFileData: SetImportFileData;
  onClose: VoidFunction;
  onNext: VoidFunction;
};

export interface ImportExportType {
  onClose: VoidFunction;
}

export type DialogType = 'import/export' | 'import/confirm';
