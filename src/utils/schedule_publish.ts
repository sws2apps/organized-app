import { SourceWeekType } from '@definition/sources';
import { sourceSchema } from '@services/dexie/schema';

/** Keep the selected data view without dropping scalar arrays such as section parts. */
export const filterScheduleByDataView = <T>(
  value: T,
  dataView: string,
  parentKey?: string
): T => {
  if (Array.isArray(value)) {
    if (parentKey === 'outgoing_talks') return structuredClone(value);

    return value
      .filter(
        (item) =>
          !item ||
          typeof item !== 'object' ||
          ((!('type' in item) || item.type === dataView) &&
            (!('dataView' in item) || item.dataView === dataView))
      )
      .map((item) => filterScheduleByDataView(item, dataView)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        filterScheduleByDataView(item, dataView, key),
      ])
    ) as T;
  }

  return value;
};

/** Publishing duties must never publish draft meeting programs. */
export const mergeDutiesSources = (
  local: SourceWeekType[],
  remote: SourceWeekType[],
  earliestWeek: string
): SourceWeekType[] => {
  const published = structuredClone(
    remote.filter((record) => record.weekOf >= earliestWeek)
  );
  for (const source of local) {
    if (published.some((record) => record.weekOf === source.weekOf)) continue;
    // New weeks only need a well-formed source shell and localized dates.
    // Songs, meeting parts, event names and talk overrides publish separately.
    const dates = structuredClone(sourceSchema);
    dates.weekOf = source.weekOf;
    dates.midweek_meeting.week_date_locale = structuredClone(
      source.midweek_meeting.week_date_locale
    );
    published.push(dates);
  }
  return published;
};
