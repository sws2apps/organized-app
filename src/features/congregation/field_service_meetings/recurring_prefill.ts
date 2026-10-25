import { FIELD_SERVICE_MEETING_DURATION_MINUTES } from '@constants/index';
import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { SettingsType } from '@definition/settings';
import { formatDate, getWeekDate } from '@utils/date';

const MEETING_DEFAULT_DURATION_MS =
  FIELD_SERVICE_MEETING_DURATION_MINUTES * 60 * 1000;

/** Weeks to scan for a free date before using the first candidate anyway. */
const MAX_WEEKS_LOOKAHEAD = 12;

/**
 * Next occurrence (from now) of the given weekday (Monday=0 … Sunday=6) at
 * "HH:mm", skipping dates that already have a meeting for the same group.
 */
export const nextUnscheduledStart = (
  weekday: number,
  time: string,
  groupId: string | undefined,
  existing: FieldServiceMeetingType[]
): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const jsDay = (weekday + 1) % 7; // Monday(0) → 1 … Sunday(6) → 0
  const now = new Date();

  const candidate = new Date(now);
  const diff = (jsDay - now.getDay() + 7) % 7;
  candidate.setDate(now.getDate() + diff);
  candidate.setHours(hours || 0, minutes || 0, 0, 0);
  if (candidate <= now) candidate.setDate(candidate.getDate() + 7);

  for (let i = 0; i < MAX_WEEKS_LOOKAHEAD; i++) {
    const dateStr = formatDate(candidate, 'yyyy/MM/dd');
    const taken = existing.some((meeting) => {
      const start = new Date(meeting.meeting_data.start);
      return (
        !meeting.meeting_data._deleted &&
        Number.isFinite(start.getTime()) &&
        // Legacy records may carry the group in `type` only.
        (meeting.meeting_data.group_id ?? meeting.meeting_data.type) ===
          groupId &&
        formatDate(start, 'yyyy/MM/dd') === dateStr
      );
    });
    if (!taken) break;
    candidate.setDate(candidate.getDate() + 7);
  }

  return candidate;
};

/**
 * Resolve the recurring meeting start/end for a group from settings, or null
 * when the group has no recurring day/time configured.
 */
export const getGroupRecurringStart = (
  settings: SettingsType,
  groupId: string | undefined,
  existing: FieldServiceMeetingType[],
  referenceDate?: Date
): { start: Date; end: Date } | null => {
  if (!groupId) return null;

  const recurring = settings.cong_settings.field_service_meeting_times?.find(
    (record) => record.type === groupId
  );

  const weekday = recurring?.weekday?.value;
  const time = recurring?.time?.value;
  if (
    !Number.isInteger(weekday) ||
    weekday < 0 ||
    weekday > 6 ||
    typeof time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    (referenceDate && !Number.isFinite(referenceDate.getTime()))
  ) {
    return null;
  }

  const start = referenceDate
    ? getWeekDate(new Date(referenceDate))
    : nextUnscheduledStart(weekday, time, groupId, existing);
  if (referenceDate) {
    const [hours, minutes] = time.split(':').map(Number);
    start.setDate(start.getDate() + weekday);
    start.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  }
  const end = new Date(start.getTime() + MEETING_DEFAULT_DURATION_MS);

  return { start, end };
};
