import { ExportType } from '../index.types';

export type AllRecordsProps = {
  action: VoidFunction;
  onClose: VoidFunction;
  type: ExportType;
  onTypeChange: (value: ExportType) => void;
};
