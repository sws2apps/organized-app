import type { HallCleaningLayoutType } from '@views/activities/hall_cleaning/index.types';

export type CleaningLayoutPreviewProps = {
  onPreviewChange: (open: boolean) => void;
  layouts: { value: HallCleaningLayoutType; label: string }[];
  value: HallCleaningLayoutType;
  onChange: (value: HallCleaningLayoutType) => void;
};
