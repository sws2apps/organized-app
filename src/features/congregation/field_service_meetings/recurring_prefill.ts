import { FIELD_SERVICE_MEETING_DURATION_MINUTES } from '@constants/index';
import { SettingsType } from '@definition/settings';
import { getWeekDate } from '@utils/date';

const MEETING_DEFAULT_DURATION_MS =
  FIELD_SERVICE_MEETING_DURATION_MINUTES * 60 * 1000;

/**
 * Resolve the recurring meeting start/end for a group from settings, or null
 * when the group has no recurring day/time configured.
 */
export const getGroupRecurringStart = (
  settings: SettingsType,
  groupId: string | undefined,
  referenceDate: Date
): { start: Date; end: Date } | null => {
  if (!groupId) return null;

  const recurring = settings.cong_settings.field_service_meeting_times?.find(
    (record) => record.type === groupId
  );

  const weekday = recurring?.weekday?.value;
  const time = recurring?.time?.value;
  if (
    typeof weekday !== 'number' ||
    !Number.isInteger(weekday) ||
    weekday < 0 ||
    weekday > 6 ||
    typeof time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    !Number.isFinite(referenceDate.getTime())
  ) {
    return null;
  }

  const start = getWeekDate(new Date(referenceDate));
  const [hours, minutes] = time.split(':').map(Number);
  start.setDate(start.getDate() + weekday);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + MEETING_DEFAULT_DURATION_MS);

  return { start, end };
};
