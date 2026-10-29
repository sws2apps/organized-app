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
