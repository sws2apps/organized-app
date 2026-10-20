import type { HallCleaningExportRowType } from '@views/activities/hall_cleaning/index.types';

export const cleaningCardLines = (
  rows: HallCleaningExportRowType[],
  columns: number
) =>
  Array.from({ length: Math.ceil(rows.length / columns) }, (_, index) =>
    rows.slice(index * columns, (index + 1) * columns)
  );
