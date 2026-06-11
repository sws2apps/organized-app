import appDb from '@db/appDb';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';

const dbUpdateFieldServiceMeetingsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);
  if (!metadata) return;
  metadata.metadata.field_service_meetings = {
    ...metadata.metadata.field_service_meetings,
    send_local: true,
  };
  await appDb.metadata.put(metadata);
};

export const dbFieldServiceMeetingsGetAll = async () => {
  return appDb.field_service_meetings.toArray();
};

export const dbFieldServiceMeetingsGetActive = async () => {
  const meetings = await appDb.field_service_meetings
    .filter((record) => !record.meeting_data._deleted)
    .toArray();
  return meetings;
};

export const dbFieldServiceMeetingsBulkSave = async (
  meetings: FieldServiceMeetingType[]
) => {
  await appDb.field_service_meetings.bulkPut(meetings);
  await dbUpdateFieldServiceMeetingsMetadata();
};

export const dbFieldServiceMeetingsSave = async (
  meeting: FieldServiceMeetingType
) => {
  await appDb.field_service_meetings.put(meeting);
  await dbUpdateFieldServiceMeetingsMetadata();
};

export const dbFieldServiceMeetingsClear = async () => {
  const records = await appDb.field_service_meetings.toArray();
  if (records.length === 0) return;
  for (const record of records) {
    record.meeting_data._deleted = true;
    record.meeting_data.updatedAt = new Date().toISOString();
  }
  await appDb.field_service_meetings.bulkPut(records);
};

export const dbFieldServiceMeetingsCleanup = async () => {
  const records = await appDb.field_service_meetings.toArray();
  if (records.length === 0) return;
  const recordsToUpdate = records.reduce(
    (acc: FieldServiceMeetingType[], current) => {
      let changed = false;
      const meeting = structuredClone(current);

      // Legacy: migrate top-level _deleted/updatedAt into meeting_data.
      if (meeting.updatedAt) {
        meeting.meeting_data._deleted = meeting._deleted;
        meeting.meeting_data.updatedAt = meeting.updatedAt;
        delete meeting._deleted;
        delete meeting.updatedAt;
        changed = true;
      }

      // Legacy: the removed "GroupMeeting" category (value 1) becomes a
      // RegularMeeting; the group association is preserved via group_id.
      if ((meeting.meeting_data.category as number) === 1) {
        meeting.meeting_data.category =
          FieldServiceMeetingCategory.RegularMeeting;
        meeting.meeting_data.updatedAt = new Date().toISOString();
        changed = true;
      }

      if (changed) acc.push(meeting);
      return acc;
    },
    []
  );
  if (recordsToUpdate.length > 0) {
    await appDb.field_service_meetings.bulkPut(recordsToUpdate);
  }
};
