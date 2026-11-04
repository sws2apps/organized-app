import { isTerritoryCoverage } from '@utils/territory_coverage';
import type { Territory } from '@definition/territory';
import type { S13Row } from '@views/territories/S13';
import { displayDate, parseDate } from '@features/territories/helpers';

export const s13Rows = (
  territory: Territory,
  format: string,
  marker: string,
  now = new Date()
): S13Row[] => {
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  ).getTime();
  const time = (value?: string) => parseDate(value)?.getTime() ?? 0;
  // a date that can't be read goes last rather than first
  const order = (value?: string) => parseDate(value)?.getTime() ?? Infinity;
  const assignments = territory.assignments
    .filter((item) => time(item.assignedOn) <= end)
    .sort((a, b) => order(a.assignedOn) - order(b.assignedOn));
  // only the publisher is printed, never the group they took it for
  const entries = assignments.map((item) => ({
    publisher: item.publisher,
    assignedOn:
      displayDate(item.assignedOn, format) +
      (marker && item.campaign ? ` (${marker})` : ''),
    completedOn:
      item.completed !== false &&
      item.returnedOn &&
      time(item.returnedOn) <= end
        ? displayDate(item.returnedOn, format)
        : undefined,
  }));
  const completed = assignments
    .filter(
      (item) =>
        isTerritoryCoverage(item) &&
        item.returnedOn &&
        time(item.returnedOn) <= end
    )
    .sort((a, b) => time(b.returnedOn) - time(a.returnedOn))[0]?.returnedOn;
  return Array.from(
    { length: Math.max(1, Math.ceil(entries.length / 4)) },
    (_, index) => ({
      number: territory.number,
      lastCompleted:
        index === 0 && completed ? displayDate(completed, format) : undefined,
      entries: entries.slice(index * 4, index * 4 + 4),
    })
  );
};
