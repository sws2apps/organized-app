import { FieldServiceMeetingType } from '@definition/field_service_meetings';

/**
 * Filter a meeting list by the active data view (main congregation, a language
 * group, …).
 *
 * - `'main'` shows everything.
 * - A group view shows meetings whose `type` or `group_id` matches that view,
 *   plus meetings explicitly typed `'main'`.
 *
 * Shared by the page hook and the schedule export so both filter identically.
 */
export const filterMeetingsByDataView = (
  meetings: FieldServiceMeetingType[],
  dataView: string
): FieldServiceMeetingType[] =>
  meetings.filter((record) => {
    if (!record) return false;
    if (dataView === 'main') return true;

    const recordType = record.meeting_data.type;
    const recordGroup = record.meeting_data.group_id;

    return (
      recordType === 'main' ||
      recordType === dataView ||
      recordGroup === dataView
    );
  });
