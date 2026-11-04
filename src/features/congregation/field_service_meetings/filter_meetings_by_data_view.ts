import { FieldServiceMeetingType } from '@definition/field_service_meetings';

/**
 * Filter meetings by the active data view: `'main'` shows everything, a group
 * view shows its own meetings plus the ones typed `'main'`. Shared by the page
 * hook and the schedule export so both filter identically.
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
