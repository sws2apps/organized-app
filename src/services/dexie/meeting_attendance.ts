import { AttendanceSaveParams } from '@definition/meeting_attendance';
import appDb from '@db/appDb';
import { meetingAttendanceSchema } from '@services/dexie/schema';

const dbUpdateMeetingAttendanceMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.meeting_attendance = {
    ...metadata.metadata.meeting_attendance,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbMeetingAttendanceSave = ({
  month,
  index,
  type,
  dataView,
  values,
  recordDeaf = false,
}: AttendanceSaveParams) =>
  appDb.transaction(
    'rw',
    appDb.meeting_attendance,
    appDb.metadata,
    async () => {
      const stored = await appDb.meeting_attendance.get(month);
      const attendance = structuredClone(
        stored && !stored._deleted?.value ? stored : meetingAttendanceSchema
      );
      attendance.month_date = month;
      if (stored?._deleted?.value) {
        attendance._deleted = {
          value: false,
          updatedAt: new Date(
            Math.max(
              Date.now(),
              (Date.parse(stored._deleted.updatedAt) || 0) + 1
            )
          ).toISOString(),
        };
      }
      const week = [
        attendance.week_1,
        attendance.week_2,
        attendance.week_3,
        attendance.week_4,
        attendance.week_5,
      ][index - 1];
      if (!week) throw new Error('error_app_generic-desc');
      const records = week[type];
      let current = records.find((row) => row.type === dataView);
      if (!current) {
        current = {
          type: dataView,
          present: undefined,
          online: undefined,
          updatedAt: '',
        };
        records.push(current);
      }
      for (const field of ['present', 'online'] as const) {
        const deafField = field === 'present' ? 'present_deaf' : 'online_deaf';
        if (!(field in values) && !(deafField in values)) continue;
        if (recordDeaf) {
          const hearing =
            field in values
              ? values[field]
              : current[field] === undefined
                ? ''
                : String(
                    Math.max(0, current[field] - (current[deafField] ?? 0))
                  );
          const deaf =
            deafField in values
              ? values[deafField]
              : (current[deafField]?.toString() ?? '');
          current[field] =
            hearing === '' && deaf === ''
              ? undefined
              : Number(hearing) + Number(deaf);
          current[deafField] = deaf === '' ? undefined : Number(deaf);
        } else {
          const count = values[field];
          if (count !== undefined)
            current[field] = count === '' ? undefined : Number(count);
        }
        if (
          current[field] !== undefined &&
          !Number.isSafeInteger(current[field])
        ) {
          throw new Error('error_app_generic-desc');
        }
      }
      current.updatedAt = new Date(
        Math.max(Date.now(), (Date.parse(current.updatedAt) || 0) + 1)
      ).toISOString();
      await appDb.meeting_attendance.put(attendance);
      await dbUpdateMeetingAttendanceMetadata();
    }
  );

export const dbMeetingAttendanceClear = async () => {
  const records = await appDb.meeting_attendance.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.meeting_attendance.bulkPut(records);
};
