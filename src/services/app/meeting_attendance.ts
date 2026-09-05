import {
  AttendanceCongregation,
  AttendanceRecordField,
  AttendanceSaveParams,
  MeetingAttendanceStats,
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { MeetingType } from '@definition/app';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

export const meetingAttendancePresentSave = async (
  params: AttendanceSaveParams
) => {
  try {
    if (
      !Number.isInteger(params.index) ||
      params.index < 1 ||
      params.index > 5 ||
      !/^\d{4}\/(0[1-9]|1[0-2])$/.test(params.month) ||
      Object.values(params.values).some(
        (value) =>
          value !== '' &&
          (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)))
      )
    )
      throw new Error('error_app_generic-desc');
    await dbMeetingAttendanceSave(params);
    return true;
  } catch (error) {
    displaySnackNotification({
      header: getTranslation({ key: 'tr_errorTitle' }),
      message: getMessageByCode(error.message),
      severity: 'error',
    });
    return false;
  }
};

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

    const weekTotal =
      sumField(records, 'present') + sumField(records, 'online');

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
