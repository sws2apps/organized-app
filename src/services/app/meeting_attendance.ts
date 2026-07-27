import { store } from '@states/index';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { debounce } from '@utils/common';
import {
  AttendanceCongregation,
  AttendanceRecordField,
  AttendanceValues,
  MeetingAttendanceStats,
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { meetingAttendanceSchema } from '@services/dexie/schema';
import { MeetingType } from '@definition/app';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

const handleUpdateRecord = ({
  index,
  month,
  type,
  values,
  dataView,
}: {
  month: string;
  index: number;
  values: AttendanceValues;
  type: MeetingType;
  dataView: string;
}) => {
  const attendances = store.get(meetingAttendanceState);

  const dbAttendance = attendances.find(
    (record) => record.month_date === month
  );

  let attendance: MeetingAttendanceType;

  if (!dbAttendance) {
    attendance = structuredClone(meetingAttendanceSchema);
    attendance.month_date = month;
  } else {
    attendance = structuredClone(dbAttendance);
  }

  const weekRecord = attendance[`week_${index}`] as WeeklyAttendance;
  const meetingRecord = weekRecord[type];

  let current = meetingRecord.find((record) => record.type === dataView);

  if (!current) {
    meetingRecord.push({
      type: dataView,
      online: undefined,
      present: undefined,
      updatedAt: '',
    });
    current = meetingRecord.find((record) => record.type === dataView);
  }

  const entries = Object.entries(values) as [AttendanceRecordField, string][];

  for (const [field, count] of entries) {
    current[field] = count.length === 0 ? undefined : +count;
  }

  current.updatedAt = new Date().toISOString();

  return attendance;
};

const handlePresentSaveDb = async ({
  index,
  month,
  type,
  values,
  dataView,
}: {
  month: string;
  index: number;
  type: MeetingType;
  values: AttendanceValues;
  dataView: string;
}) => {
  try {
    const attendance = handleUpdateRecord({
      index,
      month,
      type,
      values,
      dataView,
    });

    await dbMeetingAttendanceSave(attendance);
  } catch (error) {
    console.error(error);

    displaySnackNotification({
      header: getTranslation({ key: 'tr_errorTitle' }),
      message: getMessageByCode(error.message),
      severity: 'error',
    });
  }
};

export const meetingAttendancePresentSave = debounce(handlePresentSaveDb, 10);

const sumField = (
  records: AttendanceCongregation[],
  field: AttendanceRecordField
) => records.reduce((acc, record) => acc + (record[field] || 0), 0);

export const meetingAttendanceGetStats = (
  attendance: MeetingAttendanceType | undefined,
  meeting: MeetingType,
  category?: string
): MeetingAttendanceStats => {
  let count = 0;
  let total = 0;
  let online = 0;
  let deaf = 0;

  for (let i = 1; i <= 5; i++) {
    const weekData = attendance?.[`week_${i}`] as WeeklyAttendance;

    if (!weekData) continue;

    const records = category
      ? weekData[meeting].filter((record) => record.type === category)
      : weekData[meeting];

    const weekTotal = sumField(records, 'present') + sumField(records, 'online');

    if (weekTotal === 0) continue;

    count++;
    total += weekTotal;
    online += sumField(records, 'online');
    deaf +=
      sumField(records, 'present_deaf') + sumField(records, 'online_deaf');
  }

  const average = count === 0 ? 0 : Math.round(total / count);

  return {
    count,
    total,
    average,
    average_online: count === 0 ? 0 : Math.round(online / count),
    total_deaf: deaf,
    average_deaf: count === 0 ? 0 : Math.round(deaf / count),
  };
};
