import { promiseGetRecoil } from 'recoil-outside';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { debounce } from '@utils/common';
import {
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { meetingAttendanceSchema } from '@services/dexie/schema';
import { userDataViewState } from '@states/settings';
import { MeetingType } from '@definition/app';
import { dbMeetingAttendanceSave } from '@services/dexie/meeting_attendance';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

const handleUpdateRecord = async ({
  index,
  month,
  record,
  type,
  value,
}: {
  month: string;
  index: number;
  record: 'present' | 'online';
  value: number;
  type: MeetingType;
}) => {
  const attendances = await promiseGetRecoil(meetingAttendanceState);
  const dataView = await promiseGetRecoil(userDataViewState);

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
}: {
  count: string;
  month: string;
  index: number;
  type: MeetingType;
  record: 'present' | 'online';
}) => {
  try {
    const value = count.length === 0 ? undefined : +count;
    const attendance = await handleUpdateRecord({
      index,
      month,
      record,
      type,
      value,
    });

    await dbMeetingAttendanceSave(attendance);
  } catch (error) {
    console.error(error);

    await displaySnackNotification({
      header: getTranslation({ key: 'tr_errorTitle' }),
      message: getMessageByCode(error.message),
      severity: 'error',
    });
  }
};

export const meetingAttendancePresentSave = debounce(handlePresentSaveDb, 10);
