import type { HallCleaningExportRowType } from './index.types';

// Month labels include the year, so a December/January range stays unambiguous.
export const cleaningMonths = (rows: HallCleaningExportRowType[]) => {
  const months = new Map<string, HallCleaningExportRowType[]>();
  for (const row of rows) {
    const key = row.month ?? '';
    const entries = months.get(key) ?? [];
    entries.push(row);
    months.set(key, entries);
  }
  return [...months].map(([month, entries]) => ({ month, rows: entries }));
};
