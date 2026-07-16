import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { updatedAtOverride } from '@utils/common';
import appDb from '@db/appDb';

const useFieldServiceMeetingsImport = () => {
  const getFieldServiceMeetings = async (
    meetings: FieldServiceMeetingType[]
  ) => {
    const result: FieldServiceMeetingType[] = [];

    result.push(...meetings);

    const oldMeetings = await appDb.field_service_meetings.toArray();

    for (const oldMeeting of oldMeetings) {
      const newMeeting = meetings.find(
        (record) => record.meeting_uid === oldMeeting.meeting_uid
      );

      if (!newMeeting) {
        oldMeeting.meeting_data._deleted = true;
        oldMeeting.meeting_data.updatedAt = new Date().toISOString();

        result.push(oldMeeting);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getFieldServiceMeetings };
};

export default useFieldServiceMeetingsImport;
