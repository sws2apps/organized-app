import { store } from '@states/index';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { debounce } from '@utils/common';
import {
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { meetingAttendanceSchema } from '@services/dexie/schema';
import { MeetingType } from '@definition/app';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

/**
 * Clones the attendance record for a given month/week/meeting (creating it from
 * the schema when absent) and returns it alongside the data-view's count row,
 * ensuring that row exists. The clone keeps the write off the live atom until it
 * is persisted.
 */
const getWritableAttendance = ({
  index,
  month,
  type,
  dataView,
}: {
  index: number;
  month: string;
  type: MeetingType;
  dataView: string;
}) => {
  const attendances = store.get(meetingAttendanceState);
  const dbAttendance = attendances.find((record) => record.month_date === month);

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
    current = { type: dataView, online: undefined, present: undefined, updatedAt: '' };
    meetingRecord.push(current);
  }

  return { attendance, current };
};

const handleUpdateRecord = ({
  index,
  month,
  record,
  type,
  value,
  dataView,
}: {
  month: string;
  index: number;
  record: 'present' | 'online';
  value: number;
  type: MeetingType;
  dataView: string;
}) => {
  const { attendance, current } = getWritableAttendance({
    index,
    month,
    type,
    dataView,
  });

  current[record] = value;
  current.updatedAt = new Date().toISOString();

  return attendance;
};

const handlePresentSaveDb = async ({
  index,
  month,
  type,
  count,
  record,
  dataView,
}: {
  count: string;
  month: string;
  index: number;
  type: MeetingType;
  record: 'present' | 'online';
  dataView: string;
}) => {
  try {
    const value = count.length === 0 ? undefined : +count;
    const attendance = handleUpdateRecord({
      index,
      month,
      record,
      type,
      value,
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

/**
 * Saves one or both attendance counts (present / online) for a week in a single
 * atomic record write. Used by clicker mode, where present and online can be
 * set together — writing them through the debounced single-field save would
 * drop one of the two values.
 */
export const meetingAttendanceCountsSave = async ({
  index,
  month,
  type,
  counts,
  dataView,
}: {
  index: number;
  month: string;
  type: MeetingType;
  counts: { record: 'present' | 'online'; count: string }[];
  dataView: string;
}) => {
  try {
    const { attendance, current } = getWritableAttendance({
      index,
      month,
      type,
      dataView,
    });

    for (const { record, count } of counts) {
      current[record] = count.length === 0 ? undefined : +count;
    }

    current.updatedAt = new Date().toISOString();

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
