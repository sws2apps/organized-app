import { PageType } from '@views/components/page/index.types';

export type DutiesExportType = {
  open: boolean;
  onClose: () => void;
};

export type DutiesExportSettings = {
  orientation: PageType['orientation'];
  fontSize: number;
};
