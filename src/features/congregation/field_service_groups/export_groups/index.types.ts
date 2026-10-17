import { FSGPageOrientation } from '@views/congregation/field_service_groups/index.types';

export type ExportGroupsSettings = {
  orientation: FSGPageOrientation;
  fontSize: number;
};

export type ExportGroupsDialogProps = {
  open: boolean;
  onClose: () => void;
  onExport: (settings: ExportGroupsSettings) => void;
  isProcessing: boolean;
};
