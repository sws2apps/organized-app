import { MeetingAttendanceType } from '@definition/meeting_attendance';
import appDb from '@db/appDb';

const dbUpdateMeetingAttendanceMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.meeting_attendance = {
    ...metadata.metadata.meeting_attendance,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbMeetingAttendanceSave = async (
  attendance: MeetingAttendanceType
) => {
  await appDb.meeting_attendance.put(attendance);
  await dbUpdateMeetingAttendanceMetadata();
};

export const dbMeetingAttendanceClear = async () => {
  const records = await appDb.meeting_attendance.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.meeting_attendance.bulkPut(records);
};
